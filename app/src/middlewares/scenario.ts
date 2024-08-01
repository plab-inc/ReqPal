import {NavigationGuardNext, RouteLocationNormalized} from "vue-router";
import {useScenarioStore} from "@/stores/scenario.ts";
import {useAuthStore} from "@/stores/auth.ts";
import {useScenarioProgressStore} from "@/stores/scenarioProgress.ts";
import {useScenarioStatisticStore} from "@/stores/scenarioStatistic.ts";

export async function fetchScenarios(to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) {
    try {
        const scenarioStore = useScenarioStore();
        const scenarioProgressStore = useScenarioProgressStore();
        const scenarioStatisticStore = useScenarioStatisticStore();
        const authStore = useAuthStore();

        await scenarioStore.fetchScenarios();

        if (authStore.isTeacher) await scenarioProgressStore.fetchScenarioProgresses(scenarioStore.scenarios);
// TODO set on student
        if (authStore.isTeacher) await scenarioStatisticStore.fetchScenarioStatistic(scenarioStore.scenarios);

        return next();

    } catch (error) {
        return next({name: 'Error'});
    }
}