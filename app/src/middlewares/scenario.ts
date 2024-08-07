import {NavigationGuardNext, RouteLocationNormalized} from "vue-router";
import {useScenarioStore} from "@/stores/scenario.ts";
import {useScenarioProgressStore} from "@/stores/scenarioProgress.ts";
import {useScenarioStatisticStore} from "@/stores/scenarioStatistic.ts";
import {useAuthStore} from "@/stores/auth.ts";
import {useStepperStore} from "@/stores/stepper.ts";
import {useAchievementStore} from "@/stores/achievement.ts";

export async function fetchScenarios(to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) {
    try {
        const scenarioStore = useScenarioStore();
        const scenarioProgressStore = useScenarioProgressStore();
        const scenarioStatisticStore = useScenarioStatisticStore();
        const authStore = useAuthStore();

        await scenarioStore.fetchScenarios();
        await scenarioProgressStore.fetchScenarioProgresses(scenarioStore.scenarios);
        if (authStore.isStudent) await scenarioStatisticStore.fetchScenarioStatistics(scenarioStore.scenarios);
        return next();

    } catch (error) {
        return next({name: 'Error'});
    }
}

export async function fetchCurrentScenarioResults(to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) {
    try {
        const stepperStore = useStepperStore();
        const scenarioStatisticStore = useScenarioStatisticStore();
        const authStore = useAuthStore();

        if (stepperStore.scenario && authStore.isStudent) {
            const statistic = scenarioStatisticStore.getStatisticByScenario(stepperStore.scenario.id);
            if (statistic) {
                scenarioStatisticStore.currentScenarioStatistic = statistic;
                await scenarioStatisticStore.fetchCurrentLessonResultsForCurrentScenario();
            }
        }

        return next();
    } catch (error) {
        return next({name: 'Error'});
    }
}


export async function fetchScenarioAchievements(to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) {
    try {
        const stepperStore = useStepperStore();
        const achievementStore = useAchievementStore();

        if (stepperStore.scenario && stepperStore.scenario.achievements.length > 0) {
            let achievements = await achievementStore.fetchAchievementsByIds(stepperStore.scenario.achievements);
            if (achievements) {
                achievementStore.achievements = achievements;
            }
        }

        return next();
    } catch (error) {
        return next({name: 'Error'});
    }
}