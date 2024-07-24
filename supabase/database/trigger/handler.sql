-- Author: Fabian, Laura

create or replace function handle_new_user() returns trigger
    security definer
    SET search_path = public
    language plpgsql
as
$$
DECLARE
    user_role      text;
    teacher_id     uuid := NULL;
    achievement_id uuid;
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
        SELECT id
        INTO achievement_id
        FROM reqpal_achievements
        WHERE target_field = 'Registrierung';

        IF FOUND THEN
            INSERT INTO user_reqpal_achievements (user_id, reqpal_achievement_id, reqpal_achievement_level_id, max)
            VALUES (new.id,
                    achievement_id,
                    (SELECT id
                     FROM reqpal_achievement_levels
                     WHERE reqpal_achievement_id = achievement_id
                     ORDER BY level
                     LIMIT 1),
                    true);
        end if;
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