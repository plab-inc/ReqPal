<template>
  <div v-if="scenario">
    <v-row no-gutters justify="center">
      <v-btn block variant="outlined" text="Szenario Starten" @click="openScenario" />
    </v-row>
  </div>
</template>
<script setup lang="ts">
import { defineProps } from "vue";
import { Scenario } from "@/types/scenario.ts";
import router from "@/router/index.ts";
import { useScenarioStore } from "@/stores/scenario.ts";
import { useScenarioModelerStore } from "@/stores/scenarioModeler.ts";
import { useUtilStore } from "@/stores/util.ts";

const props = defineProps<{
  scenario?: Scenario
}>();

const scenarioStore = useScenarioStore();
const scenarioModelerStore = useScenarioModelerStore();
const utilStore = useUtilStore();

const openScenario = (scenario: Scenario) => {
  scenarioModelerStore.hydrate(scenario).then(() => {
    router.push({ path: "/scenario/builder" });
  });
};
</script>