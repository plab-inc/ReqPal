create or replace function update_user_permissions(uid uuid) returns void
    language plpgsql
as
$$
declare
    v_user_roles jsonb;
    v_permissions jsonb;
begin

    v_user_roles := get_claim(uid, 'userroles');

    v_permissions := (
        SELECT jsonb_agg(p.name)
        FROM roles r
                 JOIN role_permissions rp ON r.id = rp.role_id
                 JOIN permissions p ON rp.permission_id = p.id
        WHERE r.name = ANY(ARRAY(SELECT jsonb_array_elements_text(v_user_roles->'roles')))
    );

    perform set_claim(uid, 'permissions', v_permissions);

end;
$$;

create or replace function check_user_role(uid uuid, role text) returns boolean
    language plpgsql
as
$$
declare
    v_user_roles jsonb;
begin

    v_user_roles := get_claim(uid, 'userroles');

    RETURN role = ANY(ARRAY(SELECT jsonb_array_elements_text(v_user_roles->'roles')));
end;
$$;