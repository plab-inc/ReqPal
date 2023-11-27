import {defineStore} from 'pinia';
import profileService from "@/services/database/profile.service.ts";
import {useAuthStore} from "@/stores/auth.store.ts";

interface ProfileState {
    username: string | null;
    points: number;
    avatar: string;
}

export const useProfileStore = defineStore('profile', {
    state: (): ProfileState => ({
        username: null,
        points: 0,
        avatar: '',
    }),
    getters: {
        getAvatarURL(): string {
            return import.meta.env.BASE_URL + 'avatars/' + this.avatar + '.png';
        }
    },
    actions: {
        async fetchProfile(userId: string) {
            const data = await profileService.pull.fetchProfile(userId);

            if (data) {
                this.username = data.username;
                this.avatar = data.avatar;
            }
        },

        async fetchPoints(userId: string) {
            const data = await profileService.pull.fetchPoints(userId);
            if (data?.points) {
                this.points = data.points;
                this.points = Math.round(this.points);
            }
        },

        async checkIfUsernameExists(username: string) {
            return profileService.pull.checkIfUsernameExists(username);
        },

        async checkIfUsernameExistsExcludingUUID(username: string) {
            const authStore = useAuthStore();
            if(authStore.user) {
                return profileService.pull.checkIfUsernameExistsExcludingUUID(username, authStore.user.id);
            }
        },

        async updateProfileUsername(userUUID: string, username: string) {
            await profileService.push.updateProfileUsername(userUUID, username);
            this.username = username;
        },

        async updateProfileAvatar(userUUID: string, avatar: string) {
            await profileService.push.updateProfileAvatar(userUUID, avatar);
            this.avatar = avatar;
        },

        async getTeachers() {
            return await profileService.pull.fetchTeachers();
        }
    },
});
