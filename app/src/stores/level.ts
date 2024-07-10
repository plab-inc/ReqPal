import {defineStore} from "pinia";
import {ObjectiveLevel, ReqPalLevelDTO} from "@/types/level.ts";
import LevelService from "@/services/database/level.ts";
import {useAuthStore} from "@/stores/auth.ts";
import {AuthenticationError} from "@/errors/custom.ts";

interface LevelState {
    reqPalLevel: ReqPalLevelDTO | null,
    objectiveLevels: ObjectiveLevel[]
}

export const useLevelStore = defineStore('level', {
    state: (): LevelState => ({
        reqPalLevel: null,
        objectiveLevels: []
    }),

    getters: {
        getReqPalLevel: (state) => {
            return state.reqPalLevel;
        },
        getObjectiveLevels: (state) => {
            return state.objectiveLevels;
        }
    },

    actions: {

        async fetchReqPalLevelByUser() : Promise<ReqPalLevelDTO | undefined> {
            const authStore = useAuthStore();
            if (authStore.user) {
                const data = await LevelService.pull.fetchReqPalLevelByUser(authStore.user.id);
                if (data) this.reqPalLevel = data;
                return data;
            } else {
                throw new AuthenticationError("No authorized user found.", 401)
            }
        },

        async fetchObjectiveLevelsByUser() : Promise<ObjectiveLevel[] | undefined> {
            const authStore = useAuthStore();

            if (authStore.user) {
                const data = await LevelService.pull.fetchObjectiveLevelsByUser(authStore.user.id);
                if(data && data.length > 0) {
                    this.objectiveLevels = data;
                    return data;
                }
            } else {
                throw new AuthenticationError("No authorized user found.", 401)
            }
        },
    }
});