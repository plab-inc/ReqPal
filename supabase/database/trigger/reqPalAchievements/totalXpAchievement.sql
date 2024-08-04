-- Author: Laura

--------------------------------------------
-- React on newly gained xp on user_statistics
-- update ReqPal achievements accordingly
--------------------------------------------

DROP TRIGGER IF EXISTS handle_xp_achievement_trigger_insert ON user_statistics;
DROP TRIGGER IF EXISTS handle_xp_achievement_trigger_update ON user_statistics;
DROP FUNCTION IF EXISTS update_xp_achievement();

CREATE OR REPLACE FUNCTION update_xp_achievement()
    RETURNS TRIGGER
    LANGUAGE plpgsql AS
$$
DECLARE
    achievement_id UUID;
    new_level_id   UUID;
    new_level      INT;
    max_level      INT;
    user_max       BOOL;
BEGIN
    SELECT id
    INTO achievement_id
    FROM reqpal_achievements
    WHERE target_field = 'total_xp'
    LIMIT 1;

    SELECT max
    INTO user_max
    FROM user_reqpal_achievements
    WHERE user_id = NEW.user_id
      AND reqpal_achievement_id = achievement_id;

    IF user_max IS NOT TRUE THEN
        SELECT level, id, threshold
        INTO new_level, new_level_id
        FROM reqpal_achievement_levels
        WHERE reqpal_achievement_id = achievement_id
          AND NEW.total_reqpal_xp >= threshold
        ORDER BY level DESC
        LIMIT 1;

        IF FOUND THEN
            IF NOT EXISTS (SELECT 1
                           FROM user_reqpal_achievements
                           WHERE user_id = NEW.user_id
                             AND reqpal_achievement_id = achievement_id
                             AND reqpal_achievement_level_id = new_level_id) THEN
                SELECT MAX(level)
                INTO max_level
                FROM reqpal_achievement_levels
                WHERE reqpal_achievement_id = achievement_id;

                INSERT INTO user_reqpal_achievements (user_id, reqpal_achievement_id, created_at,
                                                      reqpal_achievement_level_id, max)
                VALUES (NEW.user_id, achievement_id, NOW(), new_level_id, (new_level >= max_level))
                ON CONFLICT (user_id, reqpal_achievement_id)
                    DO UPDATE SET reqpal_achievement_level_id = excluded.reqpal_achievement_level_id,
                                  created_at                  = EXCLUDED.created_at,
                                  max                         = (new_level >= max_level);
            END IF;
        END IF;
    END IF;
    RETURN NEW;
END;
$$;

CREATE TRIGGER handle_xp_achievement_trigger_insert
    AFTER INSERT
    ON user_statistics
    FOR EACH ROW
EXECUTE FUNCTION update_xp_achievement();

CREATE TRIGGER handle_xp_achievement_trigger_update
    AFTER UPDATE OF total_reqpal_xp
    ON user_statistics
    FOR EACH ROW
EXECUTE FUNCTION update_xp_achievement();