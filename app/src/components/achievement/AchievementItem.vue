<template>
  <v-card variant="elevated" color="primary" max-height="250" class="flex-card">
    <v-card-title>
      {{ achievement.title }}
    </v-card-title>
    <v-card-item class="flex-grow-1">
    <v-card-text>
      <div class="d-flex align-center">
        <v-img :src="getAchievementImageUrl(achievement.image)" width="60" max-width="60" class="mr-5">
        </v-img>
        <div class="text-subtitle-1 scroll-container">
          {{ achievement.description }}
        </div>
      </div>
    </v-card-text>
    </v-card-item>
  </v-card>
</template>

<script setup lang="ts">
import {Achievement} from "@/types/achievement.ts";
import {getAchievementImageUrl} from "@/utils/achievementImage.ts";

interface Props {
  achievement: Achievement;
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
