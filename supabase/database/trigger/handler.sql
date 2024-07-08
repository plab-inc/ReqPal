-- Author: Fabian, Laura

create or replace function handle_new_user() returns trigger
    security definer
    SET search_path = public
    language plpgsql
as
$$
DECLARE
    user_role  text;
    teacher_id uuid := NULL;
    xp INTEGER := 15;
begin
    user_role := new.raw_user_meta_data ->> 'role';

    IF NOT (user_role = 'student' OR user_role = 'teacher') THEN
        raise exception 'Die Rolle ist nicht gültig.';
    end if;

    IF user_role = 'teacher' THEN
        teacher_id := new.id;
    ELSE
        teacher_id := new.raw_user_meta_data ->> 'teacher';
    end if;

    insert into public.profiles (id, username, teacher, role)
    values (new.id, new.raw_user_meta_data ->> 'username', teacher_id, user_role);

    perform set_claim(new.id, 'userroles', jsonb_build_array(user_role));
    perform update_user_permissions(new.id);

    IF user_role = 'student' THEN
        INSERT INTO user_statistics (user_id, total_xp)
        VALUES (new.id, xp);

        INSERT INTO xp_activity_logs (user_id, action, received_xp)
        VALUES (new.id, 'Registrierung', xp);
    end if;

    return new;
end;
$$;

drop trigger if exists create_profile_trigger on auth.users;
create trigger create_profile_trigger
    after insert
    on auth.users
    for each row
    execute procedure public.handle_new_user();