<template>
  <v-card variant="elevated" width="600" height="200" :class="['ma-3', 'border-opacity-100', borderClass]"
          rounded elevation="10" color="surface">
    <v-card-title class="headline">
      <div class="d-flex align-center justify-space-between">
        {{ objectiveLevel.objective.name }}
        <div class="d-flex align-center">
          <v-icon left :color="color" class="mr-1">mdi-star</v-icon>
          <span v-if="!objectiveLevel.max">{{ currentLevel }} / {{ objectiveLevel.objective.max_level }}</span>
          <span v-else>MAX</span>
        </div>
      </div>
    </v-card-title>
    <v-card-subtitle> {{ objectiveLevel.objective.description }}</v-card-subtitle>
    <v-card-text>
      <div class="d-flex justify-space-between mt-2">
        <span>{{ objectiveLevel.max ? ' ' : currentLevel }}</span>
        <span>{{ nextLevel }}</span>
      </div>
      <div v-if="objectiveLevel.max">
        <v-progress-linear :color="color" min="0"
                           :max="objectiveLevel.xp_threshold ? objectiveLevel.xp_threshold : 0"
                           :model-value="objectiveLevel.xp_threshold ? objectiveLevel.xp_threshold : 0"
                           :height="15"></v-progress-linear>
        <div class="d-flex justify-space-between mt-2">
                  <span>XP: {{ objectiveLevel.xp_threshold ? objectiveLevel.xp_threshold : 0 }} / {{
                      objectiveLevel.xp_threshold ? objectiveLevel.xp_threshold : 0
                    }}</span>
        </div>
      </div>
      <div v-else>
        <v-progress-linear :color="color" min="0"
                           :max="objectiveLevel.xp_threshold ? objectiveLevel.xp_threshold : 0"
                           :model-value="objectiveLevel.xp ? objectiveLevel.xp : 0"
                           :height="15"></v-progress-linear>
        <div class="d-flex justify-space-between mt-2">
                  <span>XP: {{ objectiveLevel.xp ? objectiveLevel.xp : 0 }} / {{
                      objectiveLevel.xp_threshold ? objectiveLevel.xp_threshold : 0
                    }}</span>
        </div>
      </div>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import {ObjectiveLevel} from "@/types/level.ts";

const props = defineProps<{ objectiveLevel: ObjectiveLevel }>();

const currentLevel = props.objectiveLevel.level ? props.objectiveLevel.level : 0;
const nextLevel = props.objectiveLevel.max ? props.objectiveLevel.objective.max_level : currentLevel + 1;
const color = props.objectiveLevel.max ? 'goldColor' : currentLevel >= props.objectiveLevel.objective.max_level / 2 ? 'silverColor' : 'bronzeColor';
const borderClass = props.objectiveLevel.max ? 'borderClassGold' : currentLevel >= props.objectiveLevel.objective.max_level / 2 ? 'borderClassSilver' : 'borderClassBronze';
</script>

<style scoped>
.borderClassGold {
  border: 2px solid rgb(var(--v-theme-goldColor));
  border-radius: 8px;
}

.borderClassSilver {
  border: 2px solid rgb(var(--v-theme-silverColor));
  border-radius: 8px;
}

.borderClassBronze {
  border: 2px solid rgb(var(--v-theme-bronzeColor));
  border-radius: 8px;
}
</style>