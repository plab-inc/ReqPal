<script setup lang="ts">

import {useLessonStore} from "@/stores/lesson.store.ts";
import {useProfileStore} from "@/stores/profile.store.ts";
import {useAuthStore} from "@/stores/auth.store.ts";
import StatItem from "@/components/lesson/lessonResults/StatItem.component.vue";
import LessonQuestions from "@/components/lesson/lessonGenerator/LessonQuestions.component.vue";
import alertService from "@/services/util/alert.service.ts";
import router from "@/router";
import AlertService from "@/services/util/alert.service.ts";

const lessonStore = useLessonStore();
const currentLesson = lessonStore.getCurrentLesson?.lessonDTO;
const isFinished = lessonStore.getCurrentLesson?.isFinished;
const userScore = lessonStore.getCurrentLesson?.userScore;
const profileStore = useProfileStore();

async function resetLesson() {
  if (lessonStore.currentLesson) {
    try {
      await lessonStore.restartLessonForUser(lessonStore.currentLesson.lessonDTO.uuid);
      await router.push({name: 'Lessons'});
    } catch (error: any) {
      AlertService.addErrorAlert("Fehler beim Zurücksetzen: " + error.message);
    }
  }
}

onBeforeMount(async () => {
  const authStore = useAuthStore();
  if (authStore.user) {
    await profileStore.fetchPoints(authStore.user.id);
  }
})
</script>

<template>
  <v-container v-if="!isFinished">
    <div class="text-h2">Diese Lektion wurde noch nicht bearbeitet!</div>
  </v-container>

  <div v-else>
    <v-container>

      <v-row class="mb-4 d-flex align-center">
        <v-col md="4">
          <div class="text-h3">Ergebnisse für Lektion:</div>
        </v-col>
        <v-col md="4">
          <StatItem :text="userScore + '/' + currentLesson?.points + ' Punkten'"
                    :color="'success'"></StatItem>
        </v-col>
        <v-col md="4">
          <StatItem :text="profileStore.points + ' Gesamtpunktzahl'" :color="'primary'"></StatItem>
        </v-col>
      </v-row>

      <v-row class="mb-4">
        <v-col cols="10">
          <div class="text-h3">{{ currentLesson?.title }}</div>
          <div class="text-h5 mt-4">{{ currentLesson?.description }}</div>
        </v-col>
      </v-row>

      <v-row v-if="isFinished">
        <v-col class="d-flex justify-end my-2">
          <v-btn color="warning" class="mr-2" @click="alertService.addHelpDialog('resetLesson', resetLesson)">Nochmal
            bearbeiten
          </v-btn>
        </v-col>
      </v-row>
    </v-container>

    <v-divider></v-divider>

    <v-row class="mt-4">
      <v-col>
        <LessonQuestions></LessonQuestions>
      </v-col>
    </v-row>
  </div>
</template>

<style scoped>

</style>
