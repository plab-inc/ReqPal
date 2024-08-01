import {defineStore} from "pinia";
import {Scenario, ScenarioUserStatistic} from "@/types/scenario.ts";
import ScenarioService from "@/services/database/scenario.ts";
import {useAuthStore} from "@/stores/auth.ts";

interface ThemeState {
    scenarioStatistics: ScenarioUserStatistic[];
}

export const useScenarioStatisticStore = defineStore("scenario_statistic", {
    state: (): ThemeState => ({
        scenarioStatistics: []
    }),
    getters: {
        getStatisticByScenario: (state) => (scenario: Scenario) => {
            return state.scenarioStatistics.find(statistic => statistic.scenario === scenario);
        }
    },
    actions: {
        async fetchScenarioStatistic(scenarios: Scenario[]) {
            this.scenarioStatistics = [];
            const authStore = useAuthStore();
            if (authStore.user) {
                await ScenarioService.pull.fetchScenarioUserStatistics(scenarios, authStore.user.id);
            }
        }
    }
});