<template>
  <v-card variant="outlined" :elevation="6" density="comfortable" color="info" height="100" width="550" class="ma-2"
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
    <v-card-subtitle opacity="1">
      <div class="scroll-container">
        {{ achievement.description }}
      </div>
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
  max-height: 100px;
  overflow-y: auto;
}
</style>
