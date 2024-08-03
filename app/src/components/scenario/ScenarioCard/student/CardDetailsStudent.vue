<template>
  <v-progress-linear
    bg-color="surface-variant"
    class="my-2"
    :color=progressBarColor()
    max="5"
    disabled
    height="20"
    :model-value=progressBarStatus()
    rounded="pill"
  >
    {{ progressBarText() }}
  </v-progress-linear>
</template>
<script setup lang="ts">
import { useScenarioProgressStore } from "@/stores/scenarioProgress.ts";
import { defineProps } from "vue";
import { Scenario, ScenarioProgress } from "@/types/scenario.ts";

const props = defineProps<{
  scenario: Scenario
}>();

const scenarioProgressStore = useScenarioProgressStore();
const scenarioProgress: ScenarioProgress | undefined = scenarioProgressStore.getProgressByScenario(props.scenario);

const progressBarStatus = () => {
  if (props.scenario.locked && !scenarioProgress) return 5;

  if (scenarioProgress) {
    if (scenarioProgress.ended) return 5;
    if (scenarioProgress.started) return 2;
    return 1;
  }
  return 0;
};

const progressBarColor = () => {
  if (props.scenario.locked && !scenarioProgress) return "red";
  if (scenarioProgress) {
    if (scenarioProgress.ended) return "success";
    if (scenarioProgress.started) return "error";
    return "warning";
  }
  return "info";
};

const progressBarText = () => {
  if (props.scenario.locked && !scenarioProgress) return "Gesperrt";
  if (scenarioProgress) {
    if (scenarioProgress.ended) return "Beendet";
    if (scenarioProgress.started) return "Lektionen Gestartet";
    return "Begonnen";
  }
  return "Noch Nicht Begonnen";
};
</script>