import {defineStore} from "pinia";
import {ReqPalLevelDTO} from "@/types/level.ts";
import LevelService from "@/services/database/level.ts";
import {useAuthStore} from "@/stores/auth.ts";
import {AuthenticationError} from "@/errors/custom.ts";

interface LevelState {
    reqPalLevel: ReqPalLevelDTO | null
}

export const useLevelStore = defineStore('level', {
    state: (): LevelState => ({
        reqPalLevel: null
    }),

    getters: {
        getReqPalLevel: (state) => {
            return state.reqPalLevel;
        }
    },

    actions: {

        async fetchReqPalLevelByUser() {
            const authStore = useAuthStore();
            if (authStore.user) {
                const data = await LevelService.pull.fetchReqPalLevelByUser(authStore.user.id);
                if (data) this.reqPalLevel = data;
                return data;
            } else {
                throw new AuthenticationError("No authorized user found.", 401)
            }
        },
    }
});