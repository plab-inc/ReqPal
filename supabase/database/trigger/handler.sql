-- Author: Fabian, Laura

create or replace function handle_new_user() returns trigger
    security definer
    SET search_path = public
    language plpgsql
as
$$
DECLARE
    user_role text;
    teacher_id uuid := NULL;
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

    return new;
end;
$$;

drop trigger if exists handle_new_user_trigger on auth.users;
create trigger handle_new_user_trigger
    after insert
    on auth.users
    for each row
execute procedure public.handle_new_user();