<template>
  <div v-html="scenario ? scenario.svg : scenarioModelerStore.baseDiagramSvg" class="svg-container elevation-5" />
</template>

<script setup lang="ts">
import { defineProps } from "vue";
import { Scenario } from "@/types/scenario.ts";
import { useScenarioModelerStore } from "@/stores/scenarioModeler.ts";

const props = defineProps<{
  scenario?: Scenario
}>();

const scenarioModelerStore = useScenarioModelerStore();

</script>

<style scoped>
.svg-container {
  display: flex;
  height: 200px;
  background: white;
  overflow: hidden;
  justify-content: center;
  align-items: center;
  padding: 16px;
}
</style>