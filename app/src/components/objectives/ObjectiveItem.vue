<template>
  <v-card variant="elevated" color="primary" max-height="300">
    <v-card-title>
      {{ objectiveStatistic.objective.name }}
    </v-card-title>
    <v-card-text>
      <div class="d-flex align-center justify-space-between">
        <div class="text-subtitle-1 scroll-container">
          {{ objectiveStatistic.objective.description }}
        </div>
        <div class="d-flex justify-start align-center">
          <div class="text-subtitle-1 mr-2">
            {{ objectiveStatistic.xp }} XP
          </div>
          <v-icon left color="warning" min-width="50" max-width="100">mdi-star</v-icon>
        </div>
      </div>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import {ObjectiveStatistic} from "@/types/scenarioUserStatistic.ts";

defineProps<{ objectiveStatistic: ObjectiveStatistic }>();
</script>

<style scoped>
.scroll-container {
  max-height: 200px;
  max-width: 350px;
  overflow-y: auto;
}
</style>
