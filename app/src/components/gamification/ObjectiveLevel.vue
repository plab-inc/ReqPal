<template>
  <v-card class="flex-fill" variant="outlined" max-width="600" :color="objectiveLevel.max ? 'goldColor' : ''">
    <v-card-title class="headline">
      <div class="d-flex align-center justify-space-between">
        {{ objectiveLevel.objective.name }}
        <div class="d-flex align-center">
          <v-icon left :color="color">mdi-star</v-icon>
          <span v-if="!objectiveLevel.max">{{ currentLevel }} / {{objectiveLevel.objective.max_level}}</span>
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
      <v-progress-linear :color="color" min="0"
                         :max="objectiveLevel.xp_threshold ? objectiveLevel.xp_threshold : 0"
                         :model-value="objectiveLevel.xp ? objectiveLevel.xp : 0"
                         :height="15"></v-progress-linear>
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

const currentLevel = props.objectiveLevel.level ? props.objectiveLevel.level : 0;
const nextLevel = props.objectiveLevel.max ? currentLevel : currentLevel+1;
const color = props.objectiveLevel.max ? 'goldColor' : currentLevel >= props.objectiveLevel.objective.max_level / 2 ? 'silverColor' : 'bronzeColor';

</script>