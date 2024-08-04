-- Author: Laura

create or replace function check_max_achievements() returns trigger
    language plpgsql
as
$$
DECLARE
    maxEntries INT := 20;
    currentCount INT;
BEGIN
    SELECT COUNT(*) INTO currentCount FROM achievements WHERE user_id = NEW.user_id;

    IF currentCount >= maxEntries THEN
        RAISE EXCEPTION 'Maximale Anzahl an Achievements für diesen Nutzer erreicht';
    END IF;

    RETURN NEW;
END;
$$;

drop trigger if exists check_max_achievements_trigger on achievements;
create trigger check_max_achievements_trigger
    before insert
    on achievements
    for each row
execute procedure check_max_achievements();