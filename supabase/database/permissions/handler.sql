create or replace function handle_new_user() returns trigger
    security definer
    SET search_path = public
    language plpgsql
as
$$
begin
    insert into public.profiles (id, username, teacher)
    values (new.id, new.raw_user_meta_data ->> 'username','0295ba2e-cfb1-4b73-9946-49efce4ae3cc');

    perform set_claim(new.id, 'userroles', '["student"]');
    perform update_user_permissions(new.id);

    return new;
end;
$$;

CREATE OR REPLACE FUNCTION get_teacher_uuid(user_uuid UUID)
    RETURNS UUID AS $$
DECLARE
    teacher_uuid UUID;
BEGIN
    SELECT teacher INTO teacher_uuid
    FROM profiles
    WHERE profiles.id = user_uuid;

    RETURN teacher_uuid;
END;
$$ LANGUAGE plpgsql;