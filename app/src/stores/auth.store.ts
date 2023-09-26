import {defineStore} from 'pinia';
import {Session, User} from '@supabase/supabase-js'
import authService from "@/services/database/auth.service.ts";

interface AuthState {
    user: User | null;
    session: Session | null;
}

export const useAuthStore = defineStore('auth', {
    state: (): AuthState => ({
        user: null,
        session: null,
    }),
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
        async signUp(email: string, password: string, username: string) {
            const data = await authService.push.signUp(email, password, username);

            this.user = data.user;
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
    },
});
