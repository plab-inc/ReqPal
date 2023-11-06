import {supabase} from "@/plugins/supabase";

class AuthServiceClass {

    public push = {
        signUp: this.signUp.bind(this),
        resetPassword: this.resetPassword.bind(this),
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

    private async signUp(email: string, password: string, username: string, role: string, teacherUUID: string) {
        const {data, error} = await supabase.auth.signUp({
            email: email,
            password: password,
            options: {
                data: {
                    role: role,
                    username: username,
                    teacher: teacherUUID
                }
            }
        });
        if (error) throw error;
        console.log(data);

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

    private async getTeachers() {
        const {data, error} = await supabase
            .from('profiles')
            .select('id, username')
            .eq('role', 'teacher')

        if (error) throw error;

        if (data && data.length > 0) {
            return data as {id: string, username: string}[];
        }
    }
}

const AuthService = new AuthServiceClass();

export default AuthService;