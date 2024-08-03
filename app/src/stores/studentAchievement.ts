import {defineStore} from "pinia";
import {useAuthStore} from "@/stores/auth.ts";
import {AuthenticationError} from "@/errors/custom.ts";
import {
    StudentAchievement,
    StudentReqPalAchievement
} from "@/types/achievement.ts";
import AchievementService from "@/services/database/achievement.ts";

interface StudentAchievementState {
    achievements: StudentAchievement[],
    reqPalAchievements: StudentReqPalAchievement[]
}

export const useStudentAchievementStore = defineStore('studentAchievement', {
    state: (): StudentAchievementState => ({
        achievements: [],
        reqPalAchievements: []
    }),

    getters: {
        getAchievements: (state) => {
            return state.achievements;
        },
    },

    actions: {
        async fetchAchievementsByStudent(): Promise<StudentAchievement[] | undefined> {
            const authStore = useAuthStore();
            this.achievements = [];

            if (authStore.user && authStore.isStudent) {
                const data = await AchievementService.pull.fetchAchievementsByStudent(authStore.user.id);
                if (data && data.length > 0) {
                    this.achievements = data;
                    return data;
                }
            } else {
                throw new AuthenticationError("No authorized user found.", 401)
            }
        },

        async fetchReqPalAchievementsByStudent(): Promise<StudentReqPalAchievement[] | undefined> {
            const authStore = useAuthStore();
            this.reqPalAchievements = [];

            if (authStore.user && authStore.isStudent) {
                const data = await AchievementService.pull.fetchReqPalAchievementsByStudent(authStore.user.id);
                if (data && data.length > 0) {
                    for (const reqPalAchievement of data) {
                        const result = await AchievementService.pull.fetchPreviousReqPalAchievementLevels(reqPalAchievement);
                        if (result) {
                            result.previousLevels.sort((a, b) => b.level - a.level);
                            this.reqPalAchievements.push(result);
                        }
                    }
                    return data;
                }
            } else {
                throw new AuthenticationError("No authorized user found.", 401)
            }
        },
    }
});