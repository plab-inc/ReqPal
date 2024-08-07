-- Author: Laura

--------------------------------------------
-- React on newly gained levels on user_levels or user_reqpal_levels
-- update ReqPal achievements accordingly
--------------------------------------------

DROP TRIGGER IF EXISTS handle_level_trigger_insert ON user_levels;
DROP TRIGGER IF EXISTS handle_level_trigger_update ON user_levels;
DROP TRIGGER IF EXISTS handle_reqpal_level_trigger_insert ON user_reqpal_levels;
DROP TRIGGER IF EXISTS handle_reqpal_level_trigger_update ON user_reqpal_levels;
DROP FUNCTION IF EXISTS update_total_levels_achievement();

CREATE OR REPLACE FUNCTION update_total_levels_achievement()
    RETURNS TRIGGER
    LANGUAGE plpgsql AS
$$
DECLARE
    achievement_id UUID;
    new_level      INT;
    max_level      INT;
    total_levels   INT;
    level_id       UUID;
    user_max       BOOL;
BEGIN
    SELECT id
    INTO achievement_id
    FROM reqpal_achievements
    WHERE target_field = 'total_levels'
    LIMIT 1;

    SELECT max
    INTO user_max
    FROM user_reqpal_achievements
    WHERE user_id = NEW.user_id
      AND reqpal_achievement_id = achievement_id;

    IF user_max IS NOT TRUE THEN
        SELECT COALESCE(SUM(level), 0)
        INTO total_levels
        FROM user_levels
        WHERE user_id = NEW.user_id;

        SELECT COALESCE(SUM(level), 0) + total_levels
        INTO total_levels
        FROM user_reqpal_levels
        WHERE user_id = NEW.user_id;

        SELECT level, id, threshold
        INTO new_level, level_id
        FROM reqpal_achievement_levels
        WHERE reqpal_achievement_id = achievement_id
          AND total_levels >= threshold
        ORDER BY level DESC
        LIMIT 1;

        IF FOUND THEN
            IF NOT EXISTS (SELECT 1
                           FROM user_reqpal_achievements
                           WHERE user_id = NEW.user_id
                             AND reqpal_achievement_id = achievement_id
                             AND reqpal_achievement_level_id = level_id) THEN
                SELECT MAX(level)
                INTO max_level
                FROM reqpal_achievement_levels
                WHERE reqpal_achievement_id = achievement_id;

                INSERT INTO user_reqpal_achievements (user_id, reqpal_achievement_id, created_at,
                                                      reqpal_achievement_level_id, max)
                VALUES (NEW.user_id, achievement_id, NOW(), level_id, (new_level >= max_level))
                ON CONFLICT (user_id, reqpal_achievement_id)
                    DO UPDATE SET reqpal_achievement_level_id = EXCLUDED.reqpal_achievement_level_id,
                                  created_at                  = EXCLUDED.created_at,
                                  max                         = (new_level >= max_level);
            END IF;
        END IF;
    END IF;
    RETURN NEW;
END;
$$;

CREATE TRIGGER handle_level_trigger_insert
    AFTER INSERT
    ON user_levels
    FOR EACH ROW
EXECUTE FUNCTION update_total_levels_achievement();

CREATE TRIGGER handle_level_trigger_update
    AFTER UPDATE OF level
    ON user_levels
    FOR EACH ROW
EXECUTE FUNCTION update_total_levels_achievement();

CREATE TRIGGER handle_reqpal_level_trigger_insert
    AFTER INSERT
    ON user_reqpal_levels
    FOR EACH ROW
EXECUTE FUNCTION update_total_levels_achievement();

CREATE TRIGGER handle_reqpal_level_trigger_update
    AFTER UPDATE OF level
    ON user_reqpal_levels
    FOR EACH ROW
EXECUTE FUNCTION update_total_levels_achievement();



