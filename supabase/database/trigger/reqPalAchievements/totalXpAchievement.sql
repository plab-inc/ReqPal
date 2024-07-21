-- Author: Laura

--------------------------------------------
-- React on newly gained xp on user_statistics
-- update ReqPal achievements accordingly
--------------------------------------------

DROP TRIGGER IF EXISTS handle_xp_achievement_trigger_insert ON user_statistics;
DROP TRIGGER IF EXISTS handle_xp_achievement_trigger_update ON user_statistics;
DROP FUNCTION IF EXISTS update_xp_achievements();

CREATE OR REPLACE FUNCTION update_xp_achievements()
    RETURNS TRIGGER
    LANGUAGE plpgsql AS
$$
DECLARE
achievement_ids UUID[];
    achievement_id  UUID;
    new_level       INT;
    max_level       INT;
BEGIN
SELECT array_agg(id)
INTO achievement_ids
FROM reqpal_achievements
WHERE target_field = 'total_xp';

FOREACH achievement_id IN ARRAY achievement_ids
        LOOP
SELECT level, threshold
INTO new_level
FROM reqpal_achievement_levels
WHERE reqpal_achievement_id = achievement_id
  AND NEW.total_xp >= threshold
ORDER BY level DESC
    LIMIT 1;

IF FOUND THEN
                IF NOT EXISTS (SELECT 1
                               FROM user_reqpal_achievements
                               WHERE user_id = NEW.user_id
                                 AND reqpal_achievement_id = achievement_id
                                 AND level = new_level) THEN
SELECT MAX(level)
INTO max_level
FROM reqpal_achievement_levels
WHERE reqpal_achievement_id = achievement_id;

INSERT INTO user_reqpal_achievements (user_id, reqpal_achievement_id, created_at, level, max)
VALUES (NEW.user_id, achievement_id, NOW(), new_level, (new_level >= max_level))
    ON CONFLICT (user_id, reqpal_achievement_id)
                        DO UPDATE SET level      = EXCLUDED.level,
                                   created_at = EXCLUDED.created_at,
                                   max        = (EXCLUDED.level >= max_level);
END IF;
END IF;
END LOOP;
RETURN NEW;
END;
$$;

CREATE TRIGGER handle_xp_achievement_trigger_insert
    AFTER INSERT
    ON user_statistics
    FOR EACH ROW
    EXECUTE FUNCTION update_xp_achievements();

CREATE TRIGGER handle_xp_achievement_trigger_update
    AFTER UPDATE OF total_xp
    ON user_statistics
    FOR EACH ROW
    EXECUTE FUNCTION update_xp_achievements();