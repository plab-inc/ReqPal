<template>
  <div v-if="stepperStore.scenario">
    <div class="text-h3">
      Szenario: {{ stepperStore.scenario?.title }}
    </div>
    <v-divider opacity="1" class="my-2"/>
    <div class="text-h5">
      {{ stepperStore.scenario?.description }}
    </div>
    <v-divider opacity="1" class="my-2"/>
    <div class="text-h6">
      Lektionen in diesem Szenario: {{ stepperStore.scenario?.lessonsCount }}
    </div>
    <div class="text-h6">
      Minimal zu lösende Lektionen: {{ stepperStore.scenario?.minLessons }}
    </div>
    <div class="text-h6">
      Zu erreichende Achievements:
      <v-tooltip v-for="achievement in achievementStore.achievements" location="top center" :text="achievement.description">
        <template v-slot:activator="{ props }">
        <v-chip class="mb-1 mr-1 ml-2" color="success" v-bind="props" @click="router.push({name: 'Profil'})">
          <v-icon class="mr-2">
            <v-img :src="getAchievementImageUrl(achievement.image)"
                   :alt="'ReqPal-Achievement Level Image: '+achievement.image"></v-img>
          </v-icon>
          {{ achievement.title }}
        </v-chip>
        </template>
      </v-tooltip>
    </div>
  </div>
  <div v-else>
    <div class="text-h3">
      Kein Szenario geladen.
    </div>
  </div>
</template>
<script setup lang="ts">
import {useStepperStore} from "@/stores/stepper.ts";
import {useAchievementStore} from "@/stores/achievement.ts";
import {getAchievementImageUrl} from "@/utils/achievementImage.ts";
import router from "@/router";

const stepperStore = useStepperStore();
const achievementStore = useAchievementStore();
</script>