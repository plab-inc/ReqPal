-- Author: Laura

--------------------------------------------
-- React on newly gained xp on user_statistics
-- update ReqPal level accordingly
--------------------------------------------

DROP TRIGGER IF EXISTS handle_user_statistics_insert_trigger ON user_statistics;
DROP TRIGGER IF EXISTS handle_user_statistics_update_trigger ON user_statistics;
DROP FUNCTION IF EXISTS update_reqpal_level();
DROP FUNCTION IF EXISTS initiate_reqpal_level(UUID);
DROP FUNCTION IF EXISTS calculate_threshold(INTEGER);

CREATE OR REPLACE FUNCTION calculate_threshold(level INTEGER)
    RETURNS INTEGER
    LANGUAGE plpgsql
AS
$$
DECLARE
    base_xp INTEGER := 25;
    increment INTEGER := 50;
BEGIN
    RETURN base_xp + ((level - 1) * increment);
END;
$$;

CREATE OR REPLACE FUNCTION update_reqpal_level()
    RETURNS TRIGGER
    LANGUAGE plpgsql
AS
$$
DECLARE
    new_xp               INTEGER;
    reqpal_xp            INTEGER := 0;
    current_xp_threshold INTEGER;
    current_level        INTEGER;
    user_exists          BOOLEAN;
BEGIN
    IF TG_OP = 'INSERT' OR NEW.total_reqpal_xp IS DISTINCT FROM OLD.total_reqpal_xp THEN

        new_xp := NEW.total_reqpal_xp - COALESCE(OLD.total_reqpal_xp, 0);

        IF (new_xp > 0) THEN

            PERFORM 1
            FROM user_reqpal_levels
            WHERE user_id = NEW.user_id;

            user_exists := FOUND;

            IF NOT user_exists THEN
                current_level := 0;
                current_xp_threshold := calculate_threshold(current_level+1);
                reqpal_xp := 0;

                INSERT INTO user_reqpal_levels (user_id, xp, level, xp_threshold)
                VALUES (NEW.user_id, reqpal_xp, current_level, current_xp_threshold);
            ELSE
                SELECT xp_threshold, level, xp
                INTO current_xp_threshold, current_level, reqpal_xp
                FROM user_reqpal_levels
                WHERE user_id = NEW.user_id;
            END IF;

            new_xp := new_xp + reqpal_xp;

            WHILE new_xp >= current_xp_threshold
                LOOP
                    current_level := current_level + 1;
                    new_xp := new_xp - current_xp_threshold;
                    current_xp_threshold := calculate_threshold(current_level+1);
                END LOOP;

            UPDATE user_reqpal_levels
            SET xp           = new_xp,
                level        = current_level,
                xp_threshold = current_xp_threshold
            WHERE user_id = NEW.user_id;

        ELSE
            RAISE LOG 'Negative XP-Änderung wird nicht behandelt: %', new_xp;
        END IF;
    END IF;
    RETURN NEW;
END;
$$;

CREATE TRIGGER handle_user_statistics_insert_trigger
    AFTER INSERT
    ON user_statistics
    FOR EACH ROW
EXECUTE FUNCTION update_reqpal_level();

CREATE TRIGGER handle_user_statistics_update_trigger
    AFTER UPDATE OF total_reqpal_xp
    ON user_statistics
    FOR EACH ROW
EXECUTE FUNCTION update_reqpal_level();
