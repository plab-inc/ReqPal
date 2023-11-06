import {defineStore} from 'pinia';
import {Session, User} from '@supabase/supabase-js'
import authService from "@/services/database/auth.service.ts";

interface AuthState {
    user: User | null;
    session: Session | null;
    //userMetadata type from supabase/gotrue-js/src/lib/types.ts -> TS Error
    userMetadata: any | null;
    appMetadata: any | null;
}

export const useAuthStore = defineStore('auth', {
    state: (): AuthState => ({
        user: null,
        session: null,
        userMetadata: null,
        appMetadata: null,
    }),
    getters: {
        isLoggedIn: (state) => !!state.user,
        isAdmin: (state) => state.userMetadata?.userroles?.includes('admin'),
        isTeacher: (state) => state.appMetadata?.userroles?.includes('teacher'),
    },
    actions: {
        setSession(session: Session | null) {
            this.session = session;
            this.user = session?.user ?? null;
            this.userMetadata = session?.user?.user_metadata ?? null;
            this.appMetadata = session?.user?.app_metadata ?? null;
        },
        async signIn(email: string, password: string) {
            const data = await authService.pull.signInWithPassword(email, password);

            this.user = data.user;
            this.session = data.session;
        },
        async signUpTeacher(email: string, password: string, username: string, role: string) {
            const data = await authService.push.signUp(email, password, username, role, '');
            this.session = data.session;
        },
        async signUpStudent(email: string, password: string, username: string, role: string, teacherUUID: string) {
            const data = await authService.push.signUp(email, password, username, role, teacherUUID);
            this.session = data.session;
        },
        async signOut() {
            await authService.pull.signOut();

            this.user = null;
            this.session = null;
        },
        async resetPassword(email: string) {
            await authService.push.resetPassword(email);
        },
        async getTeachers() {
            return await authService.pull.getTeachers();
        }
    },
});
