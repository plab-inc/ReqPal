<template>
  <v-card variant="elevated" color="surface" :class="['ma-3', 'border-opacity-100', borderClass]" width="600" height="250"
          rounded elevation="10">
    <v-card-title>
      {{ achievement.title }}
    </v-card-title>
    <v-card-item>
      <v-card-text>
        <v-row>
          <v-col sm="3" class="d-flex align-center justify-center">
            <v-img :src="getAchievementImageUrl(achievement.image)" width="80" max-width="80">
            </v-img>
          </v-col>
          <v-col sm="9">
            <div class="text-subtitle-1 scroll-container">
              {{ achievement.description }}
            </div>
          </v-col>
        </v-row>
        <v-row v-if="achievement.amount > 1">
          <v-col>
            <div class="text-subtitle-1 text-center mt-2">
              {{ achievement.amount }} Mal gesammelt
            </div>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card-item>
  </v-card>
</template>

<script setup lang="ts">
import {StudentAchievement} from "@/types/achievement.ts";
import {getAchievementImageUrl} from "@/utils/achievementImage.ts";

interface Props {
  achievement: StudentAchievement;
}

const props = defineProps<Props>();
const borderClass = props.achievement.amount > 10 ? 'borderClassGold' : props.achievement.amount > 4 ? 'borderClassSilver' : 'borderClassBronze';
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
