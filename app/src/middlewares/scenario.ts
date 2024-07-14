import { NavigationGuardNext, RouteLocationNormalized } from "vue-router";
import { useScenarioStore } from "@/stores/scenario.ts";

export async function fetchScenarios(to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) {
  try {
    const scenarioStore = useScenarioStore();
    await scenarioStore.fetchScenarios()

    return next();
  } catch (error) {
    return next({name: 'Error'});
  }
}