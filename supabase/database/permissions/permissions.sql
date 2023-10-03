create or replace function update_user_permissions(user_uuid uuid) returns void
    language plpgsql
as
$$
declare
    v_user_roles jsonb;
    v_permissions jsonb;
begin

    v_user_roles := get_claim(user_uuid, 'userroles');

    v_permissions := (
        SELECT jsonb_agg(p.name)
        FROM roles r
                 JOIN role_permissions rp ON r.id = rp.role_id
                 JOIN permissions p ON rp.permission_id = p.id
        WHERE r.name = ANY(ARRAY(SELECT jsonb_array_elements_text(v_user_roles->'roles')))
    );

    perform set_claim(user_uuid, 'permissions', v_permissions);

end;
$$;

create or replace function check_user_role(user_id uuid, role text) returns boolean
    language plpgsql
as
$$
declare
    v_user_roles jsonb;
begin

    v_user_roles := get_claim(user_id, 'userroles');

    RETURN role = ANY(ARRAY(SELECT jsonb_array_elements_text(v_user_roles->'roles')));
end;
$$;