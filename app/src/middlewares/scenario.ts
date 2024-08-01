import {NavigationGuardNext, RouteLocationNormalized} from "vue-router";
import {useScenarioStore} from "@/stores/scenario.ts";
import {useScenarioProgressStore} from "@/stores/scenarioProgress.ts";
import {useScenarioStatisticStore} from "@/stores/scenarioStatistic.ts";
import {useAuthStore} from "@/stores/auth.ts";

export async function fetchScenarios(to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) {
    try {
        const scenarioStore = useScenarioStore();
        const scenarioProgressStore = useScenarioProgressStore();
        const scenarioStatisticStore = useScenarioStatisticStore();
        const authStore = useAuthStore();

        await scenarioStore.fetchScenarios();
        await scenarioProgressStore.fetchScenarioProgresses(scenarioStore.scenarios);
        if(authStore.isStudent) await scenarioStatisticStore.fetchScenarioStatistic(scenarioStore.scenarios);
        return next();

    } catch (error) {
        return next({name: 'Error'});
    }
}