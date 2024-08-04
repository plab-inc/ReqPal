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

        async fetchObjectivesByUser() : Promise<Objective[] | undefined> {
            const authStore = useAuthStore();
            if (authStore.user && authStore.user.id) {
                const data = await objectiveService.pull.fetchObjectivesByUser(authStore.user.id);
                if (data) this.objectives = data;
                return data;
            }
        },

        async fetchObjectivesByUserId(userId: string) : Promise<Objective[] | undefined> {
            const data = await objectiveService.pull.fetchObjectivesByUser(userId);
            if (data) this.objectives = data;
            return data;
        },

        async fetchObjectivesByIds(objectiveIds: string[]) : Promise<Objective[] | undefined> {
            return await objectiveService.pull.fetchObjectivesByIds(objectiveIds);
        },

        async updateCurrentObjective(objective: Objective) {
            await objectiveService.push.updateObjective(objective);
            this.currentObjective = objective;
            const index = this.objectives.findIndex(o => o.id === objective.id);
            if (index >= 0) {
                this.objectives[index] = this.currentObjective;
            }
        },

        async uploadObjective(objective: Objective) : Promise<void> {
            const authStore = useAuthStore();
            if (authStore.user && authStore.user.id) {
                const newObjective = await objectiveService.push.uploadObjective(objective, authStore.user.id);
                if (newObjective) {
                    this.objectives.push(newObjective);
                }
            }
        },

        async deleteObjectiveById(id: string) : Promise<void> {
            await objectiveService.push.deleteObjective(id);
            const index = this.objectives.findIndex(o => o.id === id);
            if (index >= 0) {
                this.objectives.splice(index, 1);
            }
        },
    }
});