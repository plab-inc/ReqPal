<template>
  <v-card variant="elevated" color="primary" class="flex-fill" max-width="600">
    <v-card-title class="headline">
      <div class="d-flex align-center justify-space-between">
        ReqPal Level
        <div class="d-flex align-center">
          <v-icon left>mdi-star</v-icon>
          <span>{{ reqPalLevel?.level }}</span>
        </div>
      </div>
    </v-card-title>
    <v-card-subtitle>Dieses Level beschreibt deine Erfahrung auf der Lernplattform.</v-card-subtitle>
    <v-card-text v-if="reqPalLevel">
      <div class="d-flex justify-space-between mt-2">
        <span>{{ reqPalLevel.level && reqPalLevel.level > 0 ? reqPalLevel.level : 0 }}</span>
        <span>{{ reqPalLevel.level && reqPalLevel.level > 0 ? reqPalLevel.level + 1 : 0 }}</span>
      </div>
      <v-progress-linear color="white" min="0" :max="reqPalLevel.xp_threshold ? reqPalLevel.xp_threshold : 0"
                         :model-value="reqPalLevel.xp ? reqPalLevel.xp : 0"
                         :height="12"></v-progress-linear>
      <div class="d-flex justify-space-between mt-2">
                  <span>XP: {{ reqPalLevel.xp ? reqPalLevel.xp : 0 }} / {{
                      reqPalLevel.xp_threshold ? reqPalLevel.xp_threshold : 0
                    }}</span>
      </div>
    </v-card-text>
    <v-card-text v-else>
      <v-alert type="info">Lade ReqPal Level...</v-alert>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import {useLevelStore} from "@/stores/level.js";
import {ref} from "vue";
import {ReqPalLevelDTO} from "@/types/level.js";

const levelStore = useLevelStore();
const reqPalLevel = ref<ReqPalLevelDTO | null>(levelStore.getReqPalLevel);
</script>