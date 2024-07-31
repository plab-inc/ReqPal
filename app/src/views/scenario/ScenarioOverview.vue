<template>
  <v-row justify="space-between" align="center" class="mb-1">
    <v-col cols="auto" class="text-h4">
      Meine Szenarien ({{scenarioStore.getScenarios.length}}/6)
    </v-col>
  </v-row>
  <v-divider></v-divider>
  <v-container>
    <v-row no-gutters justify="start">
      <div v-for="scenario in scenarioStore.getScenarios" :key="scenario.id">
        <ScenarioCard :scenario="scenario" />
      </div>
      <div v-if="scenarioStore.getScenarios.length < 6 && isTeacher">
       <ScenarioCard/>
     </div>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import ScenarioCard from "@/components/scenario/ScenarioCard/ScenarioCard.vue";
import { useScenarioStore } from "@/stores/scenario.ts";

const scenarioStore = useScenarioStore();
const isTeacher = true;
</script>