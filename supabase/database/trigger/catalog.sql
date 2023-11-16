-- Author: Fabian

create or replace function check_max_catalogs() returns trigger
    language plpgsql
as
$$
DECLARE
    maxEntries INT := 5;
    currentCount INT;
BEGIN
    SELECT COUNT(*) INTO currentCount FROM catalogs WHERE user_id = NEW.user_id;

    IF currentCount >= maxEntries THEN
        RAISE EXCEPTION 'Maximale Anzahl an Katalogen für diesen Nutzer erreicht';
    END IF;

    RETURN NEW;
END;
$$;

drop trigger if exists check_max_catalogs_trigger on catalogs;
create trigger check_max_catalogs_trigger
    before insert
    on catalogs
    for each row
execute procedure check_max_catalogs();