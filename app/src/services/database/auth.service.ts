import {supabase} from "@/plugins/supabase";

class AuthServiceClass {

    public push = {
        signUp: this.signUp.bind(this),
        resetPassword: this.resetPassword.bind(this),
        updateEmail: this.updateEmail.bind(this),
        updatePassword: this.updatePassword.bind(this),
        updateUsername: this.updateUsername.bind(this)
    };

    public pull = {
        signInWithPassword: this.signIn.bind(this),
        signOut: this.signOut.bind(this),
        getTeachers: this.getTeachers.bind(this)
    }

    private async signIn(email: string, password: string) {
        const {data, error} = await supabase.auth.signInWithPassword({
            email: email,
            password: password,
        });
        if (error) throw error;

        return data;
    }

    private async signUp(email: string, password: string, username: string, role: string, teacherUUID?: string) {
        if (teacherUUID) {
            const {data, error} = await supabase.auth.signUp({
                email: email,
                password: password,
                options: {
                    emailRedirectTo: 'https://thelethalgoose.github.io/Projektarbeit2023',
                    data: {
                        role: role,
                        username: username,
                        teacher: teacherUUID
                    }
                }
            });
            if (error) throw error;

            return data;
        } else {
            const {data, error} = await supabase.auth.signUp({
                email: email,
                password: password,
                options: {
                    data: {
                        role: role,
                        username: username,
                    }
                }
            });
            if (error) throw error;

            return data;
        }
    }

    private async signOut() {
        const {error} = await supabase.auth.signOut();
        if (error) throw error;
    }

    private async updateEmail(email: string) {
        const {data, error} =
            await supabase.auth.updateUser({email: email})

        if (error) throw error;
    }

    private async updatePassword(password: string) {
        const {data, error} =
            await supabase.auth.updateUser({password: password})
        if (error) throw error;
    }

    private async updateUsername(username: any) {
        const {data, error} = await supabase.auth.updateUser({
            data: {username: username}
        })
        if (error) throw error;
    }

    private async resetPassword(email: string) {
        const {data, error} = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: 'https://thelethalgoose.github.io/Projektarbeit2023/account',
        });
        if (error) throw error;
    }

    private async getTeachers() {
        const {data, error} = await supabase
            .from('profiles')
            .select('id, username')
            .eq('role', 'teacher')

        if (error) throw error;

        if (data && data.length > 0) {
            return data as { id: string, username: string }[];
        }
    }
}

const AuthService = new AuthServiceClass();

export default AuthService;