<template>
  <div v-if="scenario">
    <v-row no-gutters justify="center">
      <v-btn v-if="!scenarioProgress" block color="white" variant="flat" text="Szenario Beginnen"
             @click="startScenario(props.scenario)" />
      <v-btn v-if="scenarioProgress && !scenarioProgress.ended" block color="primary" variant="flat"
             text="Szenario Fortsetzen" @click="continueScenario(scenarioProgress)" />
      <v-btn v-if="scenarioProgress?.ended" block color="success" variant="flat" text="Ergebnisse Anzeigen"
             @click="continueScenario(scenarioProgress)" />
    </v-row>
  </div>
</template>
<script setup lang="ts">
import { defineProps } from "vue";
import { Scenario, ScenarioProgress } from "@/types/scenario.ts";
import router from "@/router/index.ts";
import { useUtilStore } from "@/stores/util.ts";
import ScenarioService from "@/services/database/scenario.ts";
import scenario from "@/services/database/scenario.ts";
import { useAuthStore } from "@/stores/auth.ts";
import { useStepperStore } from "@/stores/stepper.ts";
import { useScenarioProgressStore } from "@/stores/scenarioProgress.ts";

const props = defineProps<{
  scenario: Scenario
}>();

const stepperStore = useStepperStore();
const utilStore = useUtilStore();
const authStore = useAuthStore();
const scenarioProgressStore = useScenarioProgressStore();

const scenarioProgress = scenarioProgressStore.getProgressByScenario(props.scenario);

const startScenario = async (scenario: Scenario) => {
  if (authStore.user && scenario) {
    utilStore.startLoadingBar();
    await ScenarioService.push.createScenarioProgress(scenario, authStore.user.id).then((scenarioProgress: ScenarioProgress | undefined) => {
      if (scenarioProgress) {
        stepperStore.loadScenarioProgress(scenarioProgress).then(() => router.push({ path: "/scenario/loader" }));
      }
    }).finally(() => utilStore.stopLoadingBar());
  }
};

const continueScenario = async (scenarioProgress: ScenarioProgress) => {
  if (authStore.user && scenarioProgress) {
    await stepperStore.continue(scenarioProgress).then(() => router.push({ path: "/scenario/loader" }));
  }
};
</script>