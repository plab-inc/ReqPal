import {defineStore} from 'pinia';
import profileService from "@/services/database/profile.service.ts";

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
        getAvatar(): string {
            return 'avatars/' + this.avatar + '.png';
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
            if (data.points) {
                this.points = data.points;
                this.points = Math.round(this.points);
            }
        },

        async checkIfUsernameExists(username: string) {
            return profileService.pull.checkIfUsernameExists(username);
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
