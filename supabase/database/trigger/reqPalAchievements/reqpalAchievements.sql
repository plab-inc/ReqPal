-- Author: Laura

--------------------------------------------
-- update max flag in case new levels are added to existing achievements and already gained user levels
--------------------------------------------

DROP TRIGGER IF EXISTS handle_achievement_level_change ON reqpal_achievement_levels;
DROP FUNCTION IF EXISTS update_max_flag_and_level();

CREATE OR REPLACE FUNCTION update_max_flag_and_level()
    RETURNS TRIGGER
    LANGUAGE plpgsql AS
$$
DECLARE
    achievement_id   UUID;
    max_level        INT;
    current_level    INT;
    new_max_flag     BOOLEAN;
    user_achievement RECORD;
BEGIN
    IF TG_OP = 'INSERT' THEN
        achievement_id := NEW.reqpal_achievement_id;
    ELSIF TG_OP = 'DELETE' THEN
        achievement_id := OLD.reqpal_achievement_id;
    END IF;

    SELECT MAX(level)
    INTO max_level
    FROM reqpal_achievement_levels
    WHERE reqpal_achievement_id = achievement_id;

    FOR user_achievement IN
        SELECT user_id, reqpal_achievement_level_id
        FROM user_reqpal_achievements
        WHERE reqpal_achievement_id = achievement_id
        LOOP
            SELECT level
            INTO current_level
            FROM reqpal_achievement_levels
            WHERE id = user_achievement.reqpal_achievement_level_id;

            new_max_flag := (current_level >= max_level);

            UPDATE user_reqpal_achievements
            SET max = new_max_flag
            WHERE user_id = user_achievement.user_id
              AND reqpal_achievement_id = achievement_id;
        END LOOP;

    RETURN NEW;
END;
$$;

CREATE TRIGGER handle_achievement_level_change
    AFTER INSERT OR DELETE
    ON reqpal_achievement_levels
    FOR EACH ROW
EXECUTE FUNCTION update_max_flag_and_level();

--------------------------------------------
-- save gained xp for new levels in user_statistics
--------------------------------------------
DROP TRIGGER IF EXISTS trigger_calculate_xp_on_insert ON user_reqpal_achievements;
DROP TRIGGER IF EXISTS trigger_calculate_xp_on_update ON user_reqpal_achievements;
DROP FUNCTION IF EXISTS calculate_xp_on_achievement_level_change();

CREATE OR REPLACE FUNCTION calculate_xp_on_achievement_level_change()
    RETURNS TRIGGER
    LANGUAGE plpgsql AS
$$
DECLARE
    old_level    INT;
    new_level    INT;
    level_rec    RECORD;
    total_new_xp INT := 0;
    level_title  text;
BEGIN
    IF TG_OP = 'UPDATE' THEN
        SELECT level
        INTO old_level
        FROM reqpal_achievement_levels
        WHERE id = OLD.reqpal_achievement_level_id;
    ELSE
        old_level := 0;
    END IF;

    SELECT level, title
    INTO new_level, level_title
    FROM reqpal_achievement_levels
    WHERE id = NEW.reqpal_achievement_level_id;

    FOR level_rec IN
        SELECT xp
        FROM reqpal_achievement_levels
        WHERE reqpal_achievement_id = NEW.reqpal_achievement_id
          AND level > old_level
          AND level <= new_level
        LOOP
            total_new_xp := total_new_xp + level_rec.xp;
        END LOOP;

    IF total_new_xp > 0 THEN
        INSERT INTO user_statistics (user_id, total_xp)
        VALUES (NEW.user_id, total_new_xp)
        ON CONFLICT (user_id) DO UPDATE
            SET total_xp = user_statistics.total_xp + total_new_xp;

        INSERT INTO xp_activity_logs (user_id, received_xp, action)
        VALUES (NEW.user_id, total_new_xp, 'ReqPal Achievement: ' || level_title);
    END IF;

    RETURN NEW;
END;
$$;

CREATE TRIGGER trigger_calculate_xp_on_achievement_insert
    AFTER INSERT
    ON user_reqpal_achievements
    FOR EACH ROW
EXECUTE FUNCTION calculate_xp_on_achievement_level_change();

CREATE TRIGGER trigger_calculate_xp_on_achievement_update
    AFTER UPDATE OF reqpal_achievement_level_id
    ON user_reqpal_achievements
    FOR EACH ROW
EXECUTE FUNCTION calculate_xp_on_achievement_level_change();



