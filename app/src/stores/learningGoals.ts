import {defineStore} from "pinia";
import {useAuthStore} from "@/stores/auth.ts";
import {LearningGoal} from "@/types/learningGoals.ts";
import LearningGoalsService from "@/services/database/learningGoals.ts";

interface LearningGoalsState {
    learningGoals: LearningGoal[]
    currentLearningGoal: LearningGoal | null
}

export const useLearningGoalsStore = defineStore('learningGoals', {
    state: (): LearningGoalsState => ({
        learningGoals: [],
        currentLearningGoal: null
    }),

    getters: {
        getCurrentLearningGoals: (state) => {
            return state.learningGoals;
        },
        getCurrentLearningGoal: (state) => {
            return state.currentLearningGoal;
        }
    },

    actions: {

        async fetchLearningGoals() {
            const authStore = useAuthStore();
            if (authStore.user && authStore.user.id) {
                const data = await LearningGoalsService.pull.fetchLearningGoalsByUser(authStore.user.id)
                if (data) this.learningGoals = data;
                return data;
            }
        },

        async updateCurrentLearningGoal(learningGoal: LearningGoal) {
            await LearningGoalsService.push.updateLearningGoal(learningGoal);
            this.currentLearningGoal = learningGoal;
            const index = this.learningGoals.findIndex(goal => goal.id === learningGoal.id);
            if (index >= 0) {
                this.learningGoals[index] = this.currentLearningGoal;
            }
        },

        async uploadLearningGoal(goal: LearningGoal) {
            const authStore = useAuthStore();
            if (authStore.user && authStore.user.id) {
                const newGoal = await LearningGoalsService.push.uploadLearningGoal(goal, authStore.user.id);
                if (newGoal) {
                    this.learningGoals.push(newGoal);
                }
            }
        },

        async deleteLearningGoalById(id: string) {
            await LearningGoalsService.push.deleteLearningGoal(id);
            const index = this.learningGoals.findIndex(goal => goal.id === id);
            if (index >= 0) {
                this.learningGoals.splice(index, 1);
            }
        },
    }
});