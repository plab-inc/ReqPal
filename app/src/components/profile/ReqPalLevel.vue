<template>
  <v-card v-if="reqPalLevel" variant="elevated" color="surface"
          width="600" height="200"
          rounded elevation="10" :class="['ma-3', 'border-opacity-100', borderClass]">
    <v-card-title>
      <div class="d-flex align-center justify-space-between">
        ReqPal Level
        <div class="d-flex align-center">
          <v-icon left class="mr-1" :color="color">mdi-star</v-icon>
          <span>{{ reqPalLevel.level }}</span>
        </div>
      </div>
    </v-card-title>
    <v-card-subtitle>Dieses Level beschreibt deine Erfahrung auf der Lernplattform.</v-card-subtitle>
    <v-card-text>
      <div class="d-flex justify-space-between mt-2">
        <span>{{ reqPalLevel.level && reqPalLevel.level > 0 ? reqPalLevel.level : 0 }}</span>
        <span>{{ reqPalLevel.level && reqPalLevel.level > 0 ? reqPalLevel.level + 1 : 0 }}</span>
      </div>
      <v-progress-linear :color="color" min="0" :max="reqPalLevel.xp_threshold ? reqPalLevel.xp_threshold : 0"
                         :model-value="reqPalLevel.xp ? reqPalLevel.xp : 0"
                         :height="12"></v-progress-linear>
      <div class="d-flex justify-space-between mt-2">
                  <span>XP: {{ reqPalLevel.xp ? reqPalLevel.xp : 0 }} / {{
                      reqPalLevel.xp_threshold ? reqPalLevel.xp_threshold : 0
                    }}</span>
      </div>
    </v-card-text>
  </v-card>
  <v-row v-else class="text-subtitle-1">
    <v-col>
      Noch keine XP für ReqPal Level.
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
import {useLevelStore} from "@/stores/level.js";
import {ref} from "vue";
import {ReqPalLevelDTO} from "@/types/level.js";

const levelStore = useLevelStore();
const reqPalLevel = ref<ReqPalLevelDTO | null>(levelStore.getReqPalLevel);
let borderClass = 'borderClassBronze';
let color = 'bronzeColor';
if(reqPalLevel.value && reqPalLevel.value.level) {
  borderClass = reqPalLevel.value.level > 10 ? 'borderClassGold' : reqPalLevel.value.level > 4? 'borderClassSilver' : 'borderClassBronze';
  color = reqPalLevel.value.level > 10 ? 'goldColor' : reqPalLevel.value.level > 4? 'silverColor' : 'bronzeColor';
}

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