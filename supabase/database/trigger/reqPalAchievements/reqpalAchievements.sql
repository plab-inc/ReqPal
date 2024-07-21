-- Author: Laura

--------------------------------------------
-- update max flag in case new levels are added to existing achievements and already gained user levels
--------------------------------------------

DROP TRIGGER IF EXISTS handle_achievement_level_change ON reqpal_achievement_levels;
DROP FUNCTION IF EXISTS update_max_levels_new_achievement_level();

CREATE OR REPLACE FUNCTION update_max_levels_new_achievement_level()
    RETURNS TRIGGER
    LANGUAGE plpgsql AS
$$
DECLARE
    achievement_id UUID;
    max_level      INT;
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

    UPDATE user_reqpal_achievements
    SET max   = (level >= max_level),
        level = CASE
                    WHEN level >= max_level THEN max_level
                    ELSE level
            END
    WHERE reqpal_achievement_id = achievement_id;

    RETURN NEW;
END;
$$;

CREATE TRIGGER handle_achievement_level_change
    AFTER INSERT OR DELETE
    ON reqpal_achievement_levels
    FOR EACH ROW
EXECUTE FUNCTION update_max_levels_new_achievement_level();



