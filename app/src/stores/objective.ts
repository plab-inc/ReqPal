import {defineStore} from "pinia";
import {useAuthStore} from "@/stores/auth.ts";
import {Objective} from "@/types/objective.ts";
import objectiveService from "@/services/database/objective.ts";

interface ObjectiveState {
    objectives: Objective[]
    currentObjective: Objective | null
}

export const useObjectiveStore = defineStore('objective', {
    state: (): ObjectiveState => ({
        objectives: [],
        currentObjective: null
    }),

    getters: {
        getCurrentObjectives: (state) => {
            return state.objectives;
        },
        getCurrentObjective: (state) => {
            return state.currentObjective;
        },
        getObjectiveById: (state) => (id: string) => {
            return state.objectives.find(g => g.id === id);
        }
    },

    actions: {

        async fetchObjectivesByUser() {
            const authStore = useAuthStore();
            if (authStore.user && authStore.user.id) {
                const data = await objectiveService.pull.fetchObjectivesByUser(authStore.user.id);
                if (data) this.objectives = data;
                return data;
            }
        },

        async fetchObjectivesByUserId(userId: string) {
            const data = await objectiveService.pull.fetchObjectivesByUser(userId);
            if (data) this.objectives = data;
            return data;
        },

        async fetchObjectivesByIds(goalIds: string[]) {
            return await objectiveService.pull.fetchObjectivesByIds(goalIds);
        },

        async updateCurrentObjective(objective: Objective) {
            await objectiveService.push.updateObjective(objective);
            this.currentObjective = objective;
            const index = this.objectives.findIndex(goal => goal.id === objective.id);
            if (index >= 0) {
                this.objectives[index] = this.currentObjective;
            }
        },

        async uploadObjective(goal: Objective) {
            const authStore = useAuthStore();
            if (authStore.user && authStore.user.id) {
                const newGoal = await objectiveService.push.uploadObjective(goal, authStore.user.id);
                if (newGoal) {
                    this.objectives.push(newGoal);
                }
            }
        },

        async deleteObjectiveById(id: string) {
            await objectiveService.push.deleteObjective(id);
            const index = this.objectives.findIndex(goal => goal.id === id);
            if (index >= 0) {
                this.objectives.splice(index, 1);
            }
        },
    }
});