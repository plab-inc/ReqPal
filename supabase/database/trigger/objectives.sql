-- Author: Laura

CREATE OR REPLACE FUNCTION check_max_objectives()
    RETURNS TRIGGER
    LANGUAGE plpgsql
AS
$$
DECLARE
    maxEntries   INT := 5;
    currentCount INT;
BEGIN
    SELECT COUNT(*) INTO currentCount FROM objectives WHERE user_id = NEW.user_id;

    IF currentCount >= maxEntries THEN
        RAISE EXCEPTION 'Maximale Anzahl an Lernzielen für diesen Nutzer erreicht';
    END IF;

    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS check_max_objectives_trigger ON objectives;
CREATE TRIGGER check_max_objectives_trigger
    BEFORE INSERT
    ON objectives
    FOR EACH ROW
EXECUTE FUNCTION check_max_objectives();
