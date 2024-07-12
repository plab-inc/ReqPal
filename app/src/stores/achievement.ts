import {defineStore} from "pinia";
import {useAuthStore} from "@/stores/auth.ts";
import {AuthenticationError} from "@/errors/custom.ts";
import {Achievement} from "@/types/achievement.ts";
import AchievementService from "@/services/database/achievement.ts";

interface AchievementState {
    achievement: Achievement | null,
    achievements: Achievement[]
}

export const useAchievementStore = defineStore('achievement', {
    state: (): AchievementState => ({
        achievement: null,
        achievements: []
    }),

    getters: {
        getAchievement: (state) => {
            return state.achievement;
        },
        getAchievements: (state) => {
            return state.achievements;
        }
    },

    actions: {
        async fetchAchievementsByUser(): Promise<Achievement[] | undefined> {
            const authStore = useAuthStore();

            if (authStore.user) {
                const data = await AchievementService.pull.fetchAchievementsByUser(authStore.user.id);
                if (data && data.length > 0) {
                    this.achievements = data;
                    return data;
                }
            } else {
                throw new AuthenticationError("No authorized user found.", 401)
            }
        },
        async uploadAchievement(achievement: Achievement) {
            const authStore = useAuthStore();
            if (authStore.user) {
                const newAchievement = await AchievementService.push.uploadAchievement(achievement, authStore.user.id);
                if (newAchievement) {
                    this.achievements.push(newAchievement);
                }
            }
        },

        async updateAchievement(achievement: Achievement) {
            await AchievementService.push.updateAchievement(achievement);
            this.achievement = achievement;
            const index = this.achievements.findIndex(a => a.id === achievement.id);
            if (index >= 0) {
                this.achievements[index] = this.achievement;
            }
        },

        async deleteAchievement(achievementId: string) {
            await AchievementService.push.deleteAchievement(achievementId);
            const index = this.achievements.findIndex(a => a.id === achievementId);
            if (index >= 0) {
                this.achievements.splice(index, 1);
            }
        }
    }
});