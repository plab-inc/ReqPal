<template>
  <v-card :prepend-icon="achievement.max ? 'mdi-crown' : ''" variant="elevated" color="primary" max-height="250" class="flex-card">
    <template v-slot:title>
      <span> {{ currentAchievementLevel.title }}</span>
    </template>
    <v-card-item class="flex-grow-1">
      <v-card-text>
        <v-row>
          <v-col :md="maxLevel <= 1 ? 12 : 8" :lg="maxLevel <= 1 ? 12 : 9">
            <div class="d-flex align-center">
              <v-img :src="getAchievementImageUrl(currentAchievementLevel.image)" width="80" max-width="80"
                     class="mr-5">
              </v-img>
              <div class="text-subtitle-1 scroll-container">
                {{ currentAchievementLevel.description }}
              </div>
            </div>
          </v-col>
          <v-col md="4" lg="3" v-if="maxLevel > 1" class="d-flex justify-center align-center">
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
          </v-col>
        </v-row>
      </v-card-text>
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
  max-height: 200px;
  overflow-y: auto;
}

.flex-card {
  display: flex;
  flex-direction: column;
}
</style>
