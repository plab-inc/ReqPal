import {supabase} from "@/plugins/supabase";

class PermissionServiceClass {

    public push = {
        updatePermissions: this.updatePermissions.bind(this),
        setRoles: this.setRoles.bind(this)
    };

    public pull = {
        isAdmin: this.isAdmin.bind(this),
        hasRole: this.hasRole.bind(this)
    }

    private async updatePermissions(uid: string): Promise<void> {

        const { data, error } = await supabase
            .rpc('update_user_permissions', {
                uid: uid
            })

        if (error) console.error(error)
    }

    private async setRoles(uid: string, roles: string[]): Promise<void> {

        const rolesJson = { roles: roles };

        const { data, error } = await supabase
            .rpc('set_claim', {
                uid: uid,
                claim: 'userroles',
                value: rolesJson
            })

        if (error) console.error(error);

        await this.updatePermissions(uid)
    }

    private async isAdmin(): Promise<boolean | null> {

        const { data, error } = await supabase
            .rpc('is_claims_admin', {})

        if (error) console.error(error)

        return data;

    }

    private async hasRole(uid: string, role: string): Promise<boolean | null> {

        const { data, error } = await supabase
            .rpc('check_user_role', {
                uid: uid,
                role: role
            })

        if (error) console.error(error)

        return data;

    }

}

const PermissionService = new PermissionServiceClass();

export default PermissionService;