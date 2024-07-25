-- Laura

drop trigger if exists handle_teacher_approval_trigger on public.teacher_requests;
drop function if exists handle_teacher_approval();

create or replace function handle_teacher_approval() returns trigger
    SECURITY DEFINER
    SET search_path = public
    LANGUAGE plpgsql as
$$
DECLARE
    user_role text := 'teacher';
    isAdmin   bool := FALSE;
begin
    IF new.approved = TRUE THEN

        select is_claims_admin() into isAdmin;

        IF isAdmin = TRUE then
            PERFORM set_claim(NEW.user_id, 'userroles', jsonb_build_array(user_role));
            PERFORM update_user_permissions(NEW.user_id);

            UPDATE profiles
            SET role = user_role
            WHERE id = NEW.user_id;

            UPDATE auth.users
            SET raw_user_meta_data = jsonb_set(raw_user_meta_data, '{role}', to_jsonb(user_role))
            WHERE id = new.user_id;
        else
            raise exception 'Claims Admin Rechte benötigt für diese Operation.';
        end if;
    end if;
    return new;
end;
$$;

create trigger handle_teacher_approval_trigger
    after update of approved
    on public.teacher_requests
    for each row
execute procedure public.handle_teacher_approval();

create or replace function check_max_requests() returns trigger
    language plpgsql
as
$$
DECLARE
    maxEntries   INT := 1;
    currentCount INT;
BEGIN
    SELECT COUNT(*) INTO currentCount FROM teacher_requests WHERE user_id = NEW.user_id;

    IF currentCount >= maxEntries THEN
        RAISE EXCEPTION 'Maximale Anzahl an Anfragen für diesen Nutzer erreicht';
    END IF;

    RETURN NEW;
END;
$$;

drop trigger if exists check_max_requests_trigger on teacher_requests;
create trigger check_max_requests_trigger
    before insert
    on teacher_requests
    for each row
execute procedure check_max_requests();