-- Author: Laura

create or replace function check_max_learning_goals() returns trigger
    language plpgsql
as
$$
DECLARE
    maxEntries   INT := 5;
    currentCount INT;
BEGIN
    SELECT COUNT(*) INTO currentCount FROM learning_goals WHERE user_id = NEW.user_id;

    IF currentCount >= maxEntries THEN
        RAISE EXCEPTION 'Maximale Anzahl an Lernzielen für diesen Nutzer erreicht';
    END IF;

    RETURN NEW;
END;
$$;

drop trigger if exists check_max_learing_goals_trigger on learning_goals;
create trigger check_max_learning_goals_trigger
    before insert
    on learning_goals
    for each row
execute procedure check_max_learning_goals();