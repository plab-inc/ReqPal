<template>
  <v-card variant="outlined" :elevation="6" density="comfortable" color="info" height="100" class="flex-card ma-2"
          @click="router.push('/profile')">
    <v-card-title class="pr-2">
      <v-row no-gutters class="justify-space-between">
        <v-col cols="8">
          {{ achievement.title }}
        </v-col>
        <v-col cols="auto">
          <v-img :src="getAchievementImageUrl(achievement.image)" width="50" />
        </v-col>
      </v-row>
    </v-card-title>
    <v-card-subtitle>
      {{ achievement.description }}
    </v-card-subtitle>
  </v-card>
</template>

<script setup lang="ts">
import { Achievement } from "@/types/achievement.ts";
import { getAchievementImageUrl } from "@/utils/achievementImage.ts";
import router from "@/router/index.ts";

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
