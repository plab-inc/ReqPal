-- Author: Fabian

create or replace function check_max_lessons() returns trigger
    language plpgsql
as
$$
DECLARE
    maxEntries INT := 20;
    currentCount INT;
BEGIN
    SELECT COUNT(*) INTO currentCount FROM lessons WHERE user_id = NEW.user_id;

    IF currentCount >= maxEntries THEN
        RAISE EXCEPTION 'Maximale Anzahl an Lektionen für diesen Benutzer erreicht';
    END IF;

    RETURN NEW;
END;
$$;

drop trigger if exists check_max_lessons_trigger on lessons;
create trigger check_max_lessons_trigger
    before insert
    on lessons
    for each row
execute procedure check_max_lessons();