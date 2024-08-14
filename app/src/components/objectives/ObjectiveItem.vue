<template>
  <v-card density="comfortable" :elevation="6" variant="outlined" color="primary" height="100" class="ma-2"
          @click="router.push('/profile')">
    <v-card-title class="pr-2">
      <v-row no-gutters class="justify-space-between">
        <v-col cols="8">
          {{ objectiveStatistic.objective.name }}
        </v-col>
        <v-col cols="auto">
          <div class="d-flex justify-start align-center">
            <div class="text-subtitle-1 mr-2">
              {{ objectiveStatistic.xp }} XP
            </div>
            <v-icon left color="warning" width="60" max-width="60">mdi-star</v-icon>
          </div>
        </v-col>
      </v-row>
    </v-card-title>
    <v-card-item>
      <v-card-subtitle opacity="1">
        <div class="scroll-container">
          {{ objectiveStatistic.objective.description }}
        </div>
      </v-card-subtitle>
    </v-card-item>
  </v-card>
</template>

<script setup lang="ts">
import { ObjectiveStatistic } from "@/types/scenarioUserStatistic.ts";
import router from "@/router/index.ts";

defineProps<{ objectiveStatistic: ObjectiveStatistic }>();
</script>

<style scoped>
.scroll-container {
  max-height: 100px;
  overflow-y: auto;
}
</style>
