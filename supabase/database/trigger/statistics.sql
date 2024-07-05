-- Author: Laura

--------------------------------------------
-- Add newly gained xp to user_statistics
-- on insert or update on user_levels
--------------------------------------------

DROP TRIGGER IF EXISTS handle_user_level_xp_trigger ON user_levels;

CREATE OR REPLACE FUNCTION update_objective_statistics()
    RETURNS TRIGGER
    LANGUAGE plpgsql
AS
$$
DECLARE
    new_xp      INTEGER;
    xp          INTEGER := 0;
    user_exists BOOLEAN;
BEGIN
    IF TG_OP = 'INSERT' OR NEW.xp IS DISTINCT FROM OLD.xp THEN

        new_xp := NEW.xp - COALESCE(OLD.xp, 0);

        IF (new_xp > 0) THEN
            PERFORM 1
            FROM user_statistics
            WHERE user_id = NEW.user_id;

            user_exists := FOUND;

            IF NOT user_exists THEN
                INSERT INTO user_statistics (user_id, total_xp)
                VALUES (NEW.user_id, new_xp);
            ELSE
                SELECT total_xp
                INTO xp
                FROM user_statistics
                WHERE user_id = NEW.user_id;

                new_xp := new_xp + xp;

                UPDATE user_statistics
                SET total_xp = new_xp
                WHERE user_id = NEW.user_id;
            END IF;
        ELSE
            RAISE LOG 'Negative XP-Änderung wird nicht behandelt: %', new_xp;
        END IF;

    END IF;

    RETURN NEW;
END;
$$;

CREATE TRIGGER handle_user_level_xp_trigger
    AFTER INSERT OR UPDATE
    ON user_levels
    FOR EACH ROW
EXECUTE FUNCTION update_objective_statistics();