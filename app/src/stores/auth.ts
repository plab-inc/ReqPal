import { defineStore } from "pinia";
import { Session, User } from "@supabase/supabase-js";
import authService from "@/services/authentication/auth.ts";

interface AuthState {
    user: User | null;
    session: Session | null;
}

export const useAuthStore = defineStore('auth', {
    state: (): AuthState => ({
        user: null,
        session: null,
    }),
    getters: {
        isLoggedIn: (state) => !!state.user,
        isAdmin: (state) => state.user?.app_metadata.userroles?.includes("admin"),
        isTeacher: (state) => state.user?.app_metadata.userroles?.includes("teacher"),
        isStudent: (state) => {
            return state.user?.app_metadata.userroles?.includes("student");
        },
        isPending: (state) => state.user?.app_metadata.userroles?.includes("pending"),
        isModerator: (state) => state.user?.app_metadata.userroles?.includes("moderator"),
        sessionToken: (state) => state.session ? state.session.access_token : '',
    },
    actions: {
        setSession(session: Session | null) {
            this.session = session;
            this.user = session?.user ?? null;
        },
        async signIn(email: string, password: string) {
            const data = await authService.pull.signInWithPassword(email, password);
            this.user = data.user;
            this.session = data.session;
        },
        async signUp(email: string, password: string, username: string, role: string, teacherUUID?: string) {
            const data = await authService.push.signUp(email, password, username, role, teacherUUID);
            this.session = data.session;
        },
        async signOut() {
            await authService.pull.signOut();

            this.user = null;
            this.session = null;
        },
        async updateEmail(email: string) {
            await authService.push.updateEmail(email);
        },
        async updatePassword(newPassword: string) {
            await authService.push.updatePassword(newPassword);
        },
        async resetPassword(email: string) {
            await authService.push.resetPassword(email);
        },
        async updateUsername(username: string) {
            await authService.push.updateUsername(username);
        },
        async isClaimsAdmin() {
            const data = await authService.pull.isClaimsAdmin();
            if (data) return data.data;
            return false;
        }
    },
});
