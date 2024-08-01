import { NavigationGuardNext, RouteLocationNormalized } from "vue-router";
import { useScenarioStore } from "@/stores/scenario.ts";
import { useAuthStore } from "@/stores/auth.ts";
import { useScenarioProgressStore } from "@/stores/scenarioProgress.ts";

export async function fetchScenarios(to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) {
  try {
    const scenarioStore = useScenarioStore();
    const scenarioProgressStore = useScenarioProgressStore();
    const authStore = useAuthStore();

    await scenarioStore.fetchScenarios();
    await scenarioProgressStore.fetchScenarioProgresses(scenarioStore.scenarios);

    return next();

  } catch (error) {
    return next({name: 'Error'});
  }
}