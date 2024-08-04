<template>
  <v-card variant="elevated" color="primary" max-height="250" class="flex-card">
    <v-card-title>
      {{ achievement.title }}
    </v-card-title>
    <v-card-item class="flex-grow-1">
      <v-card-text>
        <v-row>
          <v-col :md="8" :lg="10">
            <div class="d-flex align-center">
              <v-img :src="getAchievementImageUrl(achievement.image)" width="80" max-width="80"
                     class="mr-5">
              </v-img>
              <div class="text-subtitle-1 scroll-container">
                {{ achievement.description }}
              </div>
            </div>
          </v-col>
          <v-col md="4" lg="2" v-if="achievement.amount > 1" class="d-flex justify-center align-center">
            <div class="text-subtitle-1 ml-1 mr-1 text-center">
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

defineProps<Props>();
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
