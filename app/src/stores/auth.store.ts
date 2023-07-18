import { supabase } from '@/plugins/supabase';
import { Session, User } from '@supabase/supabase-js'

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
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });
      if (error) throw error;

      this.user = data.user;
      this.session = data.session;
    },
    async signUp(email: string, password: string, username: string) {
      const { data, error } = await supabase.auth.signUp({
        email: email,
        password: password,
        options: {
          data: {
            username: username
          }
        }
      });
      if (error) throw error;

      this.user = data.user;
      this.session = data.session;
    },
    async signOut() {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      this.user = null;
      this.session = null;
    },
    async resetPassword(email: string) {
      const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: 'https://google.com/',
      });
      if (error) throw error;
    },
  },
});
