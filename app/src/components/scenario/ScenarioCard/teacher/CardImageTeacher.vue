<template>
  <div :style="scenario?.locked ? 'background: #908ba3': 'background: white' "
       v-html="scenario ? scenario.svg : scenarioModelerStore.baseDiagramSvg" class="svg-container elevation-5" />
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