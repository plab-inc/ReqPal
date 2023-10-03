create or replace function handle_new_user() returns trigger
    security definer
    SET search_path = public
    language plpgsql
as
$$
begin
    insert into public.profiles (id, username)
    values (new.id, new.raw_user_meta_data ->> 'username');

    perform set_claim(new.id, 'userroles', '{"roles": ["student"]}');
    perform update_user_permissions(new.id);

    return new;
end;
$$;