<template>
  <v-row justify="space-between" align="center" class="mb-1">
    <v-col cols="auto" class="text-h4">
      Meine Szenarien ({{1}}/20)
    </v-col>
  </v-row>
  <v-divider></v-divider>
  <v-container fluid>
    <v-row no-gutters justify="start">
      <ScenarioCard
        v-for="scenario in scenarioStore.getScenarios"
        :key="scenario.id"
        :scenario="scenario"
      />
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import ScenarioCard from "@/components/scenario/ScenarioCard.vue";
import { useScenarioStore } from "@/stores/scenario.ts";

const scenarioStore = useScenarioStore();
</script>