import {supabase} from "@/plugins/supabase";

class AuthServiceClass {

    public push = {
        signUp: this.signUp.bind(this),
        resetPassword: this.resetPassword.bind(this),
        updatePermissions: this.updatePermissions.bind(this),
    };

    public pull = {
        signInWithPassword: this.signIn.bind(this),
        signOut: this.signOut.bind(this),
    }

    private async signIn(email: string, password: string) {
        const {data, error} = await supabase.auth.signInWithPassword({
            email: email,
            password: password,
        });
        if (error) throw error;

        return data;
    }

    private async signUp(email: string, password: string, username: string) {
        const {data, error} = await supabase.auth.signUp({
            email: email,
            password: password,
            options: {
                data: {
                    username: username
                }
            }
        });
        if (error) throw error;

        return data;
    }

    private async signOut() {
        const {error} = await supabase.auth.signOut();
        if (error) throw error;
    }

    private async resetPassword(email: string) {
        const {data, error} = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: 'https://google.com/',
        });
        if (error) throw error;
    }

    private async updatePermissions(uuid: string) {

        //Kann nur von Nutzern aufgerufen werden, die den admin claim besitzen
        //TODO: Auslagern in permission service, schnittstellen für die einzelnen permissions, zuweisen von rollen

        const { data, error } = await supabase
            .rpc('update_user_permissions', {
                user_uuid: uuid
            })

        if (error) console.error(error)
    }

}

const AuthService = new AuthServiceClass();

export default AuthService;