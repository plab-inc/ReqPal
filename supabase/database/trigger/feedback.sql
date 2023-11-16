-- Author: Fabian

create or replace function check_max_feedback() returns trigger
    language plpgsql
as
$$
DECLARE
    maxEntries INT := 10;
    currentCount INT;
BEGIN
    SELECT COUNT(*) INTO currentCount FROM user_feedback WHERE user_id = NEW.user_id;

    IF currentCount >= maxEntries THEN
        RAISE EXCEPTION 'Maximale Anzahl an Feedbacks für diesen Benutzer erreicht';
    END IF;

    RETURN NEW;
END;
$$;

drop trigger if exists check_max_feedbacks_trigger on user_feedback;
create trigger check_max_feedbacks_trigger
    before insert
    on user_feedback
    for each row
execute procedure check_max_feedback();