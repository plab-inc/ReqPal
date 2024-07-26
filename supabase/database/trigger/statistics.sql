-- Author: Laura

--------------------------------------------
-- Add newly gained xp to user_statistics
-- on insert or update on user_levels
-- on insert or update on user_achievements
--------------------------------------------

DROP TRIGGER IF EXISTS handle_user_level_xp_trigger ON user_levels;

CREATE OR REPLACE FUNCTION update_objective_statistics()
    RETURNS TRIGGER
    LANGUAGE plpgsql
AS
$$
DECLARE
    received_xp     INTEGER;
    new_xp          INTEGER;
    xp              INTEGER := 0;
    user_exists     BOOLEAN;
    objective_title text;
BEGIN
    IF TG_OP = 'INSERT' OR NEW.xp IS DISTINCT FROM OLD.xp THEN

        received_xp := NEW.xp - COALESCE(OLD.xp, 0);

        IF (received_xp > 0) THEN
            PERFORM 1
            FROM user_statistics
            WHERE user_id = NEW.user_id;

            user_exists := FOUND;

            IF NOT user_exists THEN
                INSERT INTO user_statistics (user_id, total_xp)
                VALUES (NEW.user_id, received_xp);
            ELSE
                SELECT total_xp
                INTO xp
                FROM user_statistics
                WHERE user_id = NEW.user_id;

                new_xp := received_xp + xp;

                UPDATE user_statistics
                SET total_xp = new_xp
                WHERE user_id = NEW.user_id;
            END IF;

            SELECT name
            INTO objective_title
            FROM objectives
            WHERE id = NEW.objective_id;

            INSERT INTO xp_activity_logs (user_id, action, received_xp)
            VALUES (NEW.user_id, 'Lernziel: ' || objective_title, received_xp);

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

DROP TRIGGER IF EXISTS handle_user_achievement_xp_trigger ON user_achievements;

CREATE OR REPLACE FUNCTION update_achievement_statistics()
    RETURNS TRIGGER
    LANGUAGE plpgsql
AS
$$
DECLARE
    new_xp            INTEGER := 0;
    received_xp       INTEGER := 25;
    xp                INTEGER := 0;
    user_exists       BOOLEAN;
    achievement_title text;
BEGIN
    IF TG_OP = 'INSERT' OR NEW.amount IS DISTINCT FROM OLD.amount THEN
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

            new_xp := received_xp + xp;

            UPDATE user_statistics
            SET total_xp = new_xp
            WHERE user_id = NEW.user_id;
        END IF;

        SELECT title
        INTO achievement_title
        FROM achievements
        WHERE id = NEW.achievement_id;

        INSERT INTO xp_activity_logs (user_id, action, received_xp)
        VALUES (NEW.user_id, 'Achievement: ' || achievement_title, received_xp);

    END IF;

    RETURN NEW;
END;
$$;

CREATE TRIGGER handle_user_achievement_xp_trigger
    AFTER INSERT OR UPDATE
    ON user_achievements
    FOR EACH ROW
EXECUTE FUNCTION update_achievement_statistics();