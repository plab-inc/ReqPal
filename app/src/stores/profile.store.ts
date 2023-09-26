import {defineStore} from 'pinia';
import profileService from "@/services/database/profile.service.ts";

interface ProfileState {
    username: string | null;
}

export const useProfileStore = defineStore('profile', {
    state: (): ProfileState => ({
        username: null,
    }),
    actions: {
        async fetchProfile(userId: string) {
            const data = await profileService.pull.fetchProfile(userId);

            if (data) {
                this.username = data.username;
            }
        },
    },
});
