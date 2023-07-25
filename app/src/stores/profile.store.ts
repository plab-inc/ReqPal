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

      const storedUserData = localStorage.getItem('user');

      if (storedUserData) {
        const userData = JSON.parse(storedUserData);
        if(userId === userData.userId) {
          this.username = userData.username;
          return;
        }
      }

      const { data, error } = await supabase
        .from('profiles')
        .select('username')
        .eq('id', userId)
        .single();

      if (error) throw error;

      if (data) {
        this.username = data.username;
      }

      const userData = {
        userId: userId,
        username: this.username
      };

      localStorage.setItem('user', JSON.stringify(userData));
    },
  },
});
