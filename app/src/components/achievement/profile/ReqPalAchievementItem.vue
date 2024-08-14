<template>
  <v-card :prepend-icon="achievement.max ? 'mdi-crown' : ''" variant="elevated" color="surface"
          :class="['ma-3', 'border-opacity-100', borderClass]" width="600" height="250"
          rounded elevation="10">
    <template v-slot:title>
      <span>{{ currentAchievementLevel.title }}</span>
    </template>
    <v-card-item>
      <v-card-text>
        <v-row>
          <v-col sm="3" class="d-flex align-center justify-center">
            <v-img :src="getAchievementImageUrl(currentAchievementLevel.image)" width="80" max-width="80">
            </v-img>
          </v-col>
          <v-col sm="9">
            <div class="text-subtitle-1 scroll-container">
              {{ currentAchievementLevel.description }}
            </div>
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-actions v-if="maxLevel > 1" class="d-flex justify-center align-center">
        <v-btn variant="plain" size="35" @click="selectPreviousLevel" color="secondary"
               :disabled="currentAchievementLevel.level <= 1" icon="mdi-chevron-left">
        </v-btn>
        <div class="text-subtitle-1 ml-1 mr-1">
          {{ currentAchievementLevel.level }}/{{ maxLevel }}
        </div>
        <v-btn variant="plain" size="35" @click="selectNextLevel"
               :disabled="currentAchievementLevel.level >= maxLevel"
               color="secondary"
               class="ml-1" icon="mdi-chevron-right"
        >
        </v-btn>
      </v-card-actions>
    </v-card-item>
  </v-card>
</template>

<script setup lang="ts">
import {getAchievementImageUrl} from "@/utils/achievementImage.ts";
import {StudentReqPalAchievement, StudentReqPalAchievementLevel} from "@/types/achievement.ts";
import {ref} from "vue";

interface Props {
  achievement: StudentReqPalAchievement
}

const props = defineProps<Props>();

const currentAchievementLevel = ref<StudentReqPalAchievementLevel>(props.achievement.currentLevel);
const maxLevel = props.achievement.previousLevels.length;
const borderClass = props.achievement.max ? 'borderClassGold' : props.achievement.currentLevel.level > 1 ? 'borderClassSilver' : 'borderClassBronze';

function selectPreviousLevel() {
  const currentLevel = currentAchievementLevel.value.level;
  const found = props.achievement.previousLevels.find(l => l.level === currentLevel - 1);
  if (found) currentAchievementLevel.value = found;
}

function selectNextLevel() {
  const currentLevel = currentAchievementLevel.value.level;
  const found = props.achievement.previousLevels.find(l => l.level === currentLevel + 1);
  if (found) currentAchievementLevel.value = found;
}
</script>

<style scoped>
.scroll-container {
  max-height: 100px;
  overflow-y: auto;
}
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
