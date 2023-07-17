// profile.store.ts
import { defineStore } from 'pinia';
import { supabase } from '@/plugins/supabase';

interface ProfileState {
  username: string | null;
}

export const useProfileStore = defineStore('profile', {
  state: (): ProfileState => ({
    username: null,
  }),
  actions: {
    async fetchProfile(userId: string) {
      const { data, error } = await supabase
        .from('profiles')
        .select('username')
        .eq('id', userId)
        .single();

      if (error) throw error;

      if (data) {
        this.username = data.username;
      }
    },
  },
});
