import {defineStore} from "pinia";
import {useAuthStore} from "@/stores/auth.ts";
import {AuthenticationError} from "@/errors/custom.ts";
import {Achievement, ReqPalAchievement, ReqPalAchievementLevelDTO} from "@/types/achievement.ts";
import AchievementService from "@/services/database/achievement.ts";

interface AchievementState {
    achievement: Achievement | null,
    reqPalAchievement: ReqPalAchievement | null,
    reqPalAchievementLevel: ReqPalAchievementLevelDTO | null,
    achievements: Achievement[],
    reqPalAchievements: ReqPalAchievement[],
    images: string[]
}

export const useAchievementStore = defineStore('achievement', {
    state: (): AchievementState => ({
        achievement: null,
        reqPalAchievement: null,
        reqPalAchievementLevel: null,
        achievements: [],
        reqPalAchievements: [],
        images: []
    }),

    getters: {
        getAchievement: (state) => {
            return state.achievement;
        },
        getAchievements: (state) => {
            return state.achievements;
        },
        getReqPalAchievement: (state) => {
            return state.reqPalAchievement;
        },
        getReqPalAchievements: (state) => {
            return state.reqPalAchievements;
        },
        getReqPalAchievementLevel: (state) => {
            return state.reqPalAchievementLevel;
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

        async fetchAchievementsByIds(achievementIds: string[]): Promise<Achievement[] | undefined> {
            return await AchievementService.pull.fetchAchievementsByIds(achievementIds);
        },

        async fetchAchievementImages(): Promise<void> {
            const authStore = useAuthStore();

            if (authStore.user) {
                this.images = [];
                const badges = await AchievementService.pull.fetchAchievementImages('badges');
                this.images = [...badges];
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
        },

        async fetchReqPalAchievementsByModerator(): Promise<ReqPalAchievement[] | undefined> {
            const authStore = useAuthStore();

            if (authStore.user) {
                const data = await AchievementService.pull.fetchAchievementsByModerator(authStore.user.id);
                if (data && data.length > 0) {
                    this.reqPalAchievements = data;
                    return data;
                }
            } else {
                throw new AuthenticationError("No authorized user found.", 401)
            }
        },

        async fetchReqPalAchievementImages(): Promise<void> {
            const authStore = useAuthStore();

            if (authStore.user) {
                this.images = [];
                const badges = await AchievementService.pull.fetchAchievementImages('reqpal');
                this.images = [...badges];
            } else {
                throw new AuthenticationError("No authorized user found.", 401)
            }
        },

        async uploadReqPalAchievement(achievement: ReqPalAchievement) {
            const authStore = useAuthStore();
            if (authStore.user) {
                const newAchievement = await AchievementService.push.uploadReqPalAchievement(achievement, authStore.user.id);
                if (newAchievement) {
                    this.reqPalAchievements.push(newAchievement);
                }
            }
        },

        async updateReqPalAchievement(achievement: ReqPalAchievement) {
            await AchievementService.push.updateReqPalAchievement(achievement);
            this.reqPalAchievement = achievement;
            const index = this.reqPalAchievements.findIndex(a => a.id === achievement.id);
            if (index >= 0) {
                this.reqPalAchievements[index] = this.reqPalAchievement;
            }
        },

        async deleteReqPalAchievement(achievementId: string) {
            await AchievementService.push.deleteReqPalAchievement(achievementId);
            const index = this.reqPalAchievements.findIndex(a => a.id === achievementId);
            if (index >= 0) {
                this.reqPalAchievements.splice(index, 1);
            }
        },

        async uploadReqPalAchievementLevel(achievement: ReqPalAchievementLevelDTO) {
            const authStore = useAuthStore();
            if (authStore.user) {
                const newAchievementLevel = await AchievementService.push.uploadReqPalAchievementLevel(achievement);
                if (newAchievementLevel && this.reqPalAchievement) {
                    this.reqPalAchievement.levels.push(newAchievementLevel);
                    this.sortLevelsAsc(this.reqPalAchievement);
                }
            }
        },

        async updateReqPalAchievementLevel(achievement: ReqPalAchievementLevelDTO) {
            await AchievementService.push.updateReqPalAchievementLevel(achievement);
            if (this.reqPalAchievement) {
                const index = this.reqPalAchievement.levels.findIndex(l => l.id === achievement.id);
                if (index >= 0) {
                    this.reqPalAchievement.levels[index] = achievement;
                    this.sortLevelsAsc(this.reqPalAchievement);
                }
            }
        },

        async deleteReqPalAchievementLevel(achievementLevel: ReqPalAchievementLevelDTO) {
            await AchievementService.push.deleteReqPalAchievementLevel(achievementLevel.id);
            const achievement = this.reqPalAchievements.find(a => a.id === achievementLevel.reqpal_achievement_id);
            if (achievement) {
                const index = achievement.levels.findIndex(l => l.id === achievementLevel.id);
                if (index >= 0) {
                    achievement.levels.splice(index, 1);
                }
            }
        },

        sortLevelsAsc(achievement: ReqPalAchievement) {
            return achievement.levels.sort((a, b) => a.level - b.level);
        }
    }
});