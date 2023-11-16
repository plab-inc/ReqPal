-- Author: Fabian

create or replace function check_max_questions_in_lesson() returns trigger
    language plpgsql
as
$$
DECLARE
    maxEntries INT := 20;
    currentCount INT;
BEGIN
    SELECT COUNT(*) INTO currentCount FROM questions WHERE lesson_uuid = NEW.uuid;

    IF currentCount >= maxEntries THEN
        RAISE EXCEPTION 'Maximale Anzahl an Fragen für diese Lektion erreicht';
    END IF;

    RETURN NEW;
END;
$$;

drop trigger if exists check_max_questions_in_lesson_trigger on lessons;
create trigger check_max_questions_in_lesson_trigger
    before insert
    on lessons
    for each row
execute procedure check_max_questions_in_lesson();