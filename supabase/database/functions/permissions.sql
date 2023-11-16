-- Author: Fabian

create or replace function check_user_role(uid uuid, role text) returns boolean
    language plpgsql
as
$$
declare
    v_user_roles jsonb;
begin

    v_user_roles := get_claim(uid, 'userroles');

    RETURN role = ANY(ARRAY(SELECT jsonb_array_elements_text(v_user_roles)));
end;
$$;

create or replace function get_teacher_uuid(user_uuid uuid) returns uuid
    language plpgsql
as
$$
DECLARE
    teacher_uuid UUID;
BEGIN
    SELECT teacher INTO teacher_uuid
    FROM profiles
    WHERE profiles.id = user_uuid;

    RETURN teacher_uuid;
END;
$$;

create or replace function role_has_permission(role text, permission integer) returns boolean
    language plpgsql
as
$$
DECLARE
    hasPermission BOOLEAN;
BEGIN

    SELECT INTO hasPermission
        EXISTS (
            SELECT 1
            FROM roles
            WHERE name = role
        );

    IF hasPermission THEN
        SELECT INTO hasPermission
            EXISTS (
                SELECT 1
                FROM role_permissions
                WHERE role_id = (SELECT id FROM roles WHERE name = role) AND permission_id = permission
            );
    END IF;

    RETURN hasPermission;
END;
$$;

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
        SELECT jsonb_agg(DISTINCT p.name)
        FROM roles r
                 JOIN role_permissions rp ON r.id = rp.role_id
                 JOIN permissions p ON rp.permission_id = p.id
        WHERE r.name = ANY(ARRAY(SELECT jsonb_array_elements_text(v_user_roles)))
    );

    perform set_claim(uid, 'permissions', v_permissions);

end;
$$;