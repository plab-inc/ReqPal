<template>
  <v-tooltip location="top center" :text="achievement.description">
    <template v-slot:activator="{ props }">
      <v-chip :class="chipClass" color="success" v-bind="props" @click="router.push({name: 'Profil'})">
        <v-icon class="mr-2">
          <v-img :src="getAchievementImageUrl(achievement.image)"
                 :alt="'ReqPal-Achievement Level Image: '+achievement.image"></v-img>
        </v-icon>
        {{ achievement.title }}
      </v-chip>
    </template>
  </v-tooltip>
</template>

<script setup lang="ts">
import {Achievement} from "@/types/achievement.ts";
import {getAchievementImageUrl} from "@/utils/achievementImage.ts";
import router from "@/router";

interface Props {
  achievement: Achievement;
  chipClass?: string;
}

defineProps<Props>();
</script>

