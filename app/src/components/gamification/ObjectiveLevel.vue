<template>

  <v-card class="flex-fill" max-width="600">
    <v-card-title class="headline">
      <div class="d-flex align-center justify-space-between">
        {{ objectiveLevel.objective.name }}
        <div class="d-flex align-center">
          <v-icon left>mdi-star</v-icon>
          <span>{{ objectiveLevel.level }}</span>
        </div>
      </div>
    </v-card-title>
    <v-card-subtitle> {{ objectiveLevel.objective.description }}</v-card-subtitle>
    <v-card-text>
      <div class="d-flex justify-space-between mt-2">
        <span>{{ objectiveLevel.level && objectiveLevel.level > 0 ? objectiveLevel.level : 0 }}</span>
        <span>{{ objectiveLevel.level && objectiveLevel.level > 0 ? objectiveLevel.level + 1 : 0 }}</span>
      </div>
      <v-progress-linear color="primary" min="0"
                         :max="objectiveLevel.xp_threshold ? objectiveLevel.xp_threshold : 0"
                         :model-value="objectiveLevel.xp ? objectiveLevel.xp : 0"
                         :height="12"></v-progress-linear>
      <div class="d-flex justify-space-between mt-2">
                  <span>XP: {{ objectiveLevel.xp ? objectiveLevel.xp : 0 }} / {{
                      objectiveLevel.xp_threshold ? objectiveLevel.xp_threshold : 0
                    }}</span>
      </div>
    </v-card-text>
  </v-card>

</template>

<script setup lang="ts">
import {ObjectiveLevel} from "@/types/level.js";

const props = defineProps<{ objectiveLevel: ObjectiveLevel }>();

</script>