import { NavigationGuardNext, RouteLocationNormalized } from "vue-router";
import { useScenarioStore } from "@/stores/scenario.ts";
import { useStepperStore } from "@/stores/stepper.ts";

export async function fetchScenarios(to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) {
  try {
    const scenarioStore = useScenarioStore();
    await scenarioStore.fetchScenarios()

    return next();
  } catch (error) {
    return next({name: 'Error'});
  }
}

export async function fetchScenarioProgress(to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) {
  try {
    const stepperStore = useStepperStore();
    await stepperStore.fetchScenarioProgress();

    return next();
  } catch (error) {
    return next({ name: "Error" });
  }
}