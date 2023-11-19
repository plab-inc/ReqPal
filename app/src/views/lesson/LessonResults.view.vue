<script setup lang="ts">

import {useLessonStore} from "@/stores/lesson.store.ts";
import {useProfileStore} from "@/stores/profile.store.ts";
import {useAuthStore} from "@/stores/auth.store.ts";
import StatItem from "@/components/lesson/lessonResults/StatItem.component.vue";
import LessonQuestions from "@/components/lesson/lessonGenerator/LessonQuestions.component.vue";
import AlertService from "@/services/util/alert.service.ts";
import FeedbackItem from "@/components/lesson/lessonResults/FeedbackItem.component.vue";
import ScoreItem from "@/components/lesson/lessonResults/ScoreItem.component.vue";

const lessonStore = useLessonStore();
const currentLesson = lessonStore.getCurrentLesson?.lessonDTO;
const isFinished = lessonStore.getCurrentLesson?.isFinished;
const profileStore = useProfileStore();

const finishedForFirstTime = ref<boolean>(true);
const userScore = lessonStore.getCurrentLesson?.userScore;
const newScore = ref<number>();

onBeforeMount(async () => {
  const authStore = useAuthStore();
  if (authStore.user && currentLesson) {
    try {
      await profileStore.fetchPoints(authStore.user.id);
      const data = await lessonStore.checkLessonFinishedForFirstTime(currentLesson.uuid);
      if (data !== null && data !== undefined) finishedForFirstTime.value = data;
      newScore.value = await lessonStore.getUserResultsForLesson(currentLesson.uuid);
    } catch (error: any) {
      AlertService.addErrorAlert('Ein Fehler ist aufgetreten.');
    }
  }
})
</script>

<template>
  <v-container v-if="!isFinished">
    <div class="text-h2">Diese Lektion wurde noch nicht bearbeitet!</div>
  </v-container>

  <div v-else>
    <v-container>
      <v-row>
        <v-col md="9">
          <div class="text-h3">Ergebnisse</div>
          <div class="text-h3 mt-4">{{ currentLesson?.title }}</div>
          <div class="text-h5 mt-4">{{ currentLesson?.description }}</div>
        </v-col>
        <v-col md="3">
          <v-row>
            <v-col>
              <StatItem :headline="'Ihre Gesamtpunkte:'" :text="profileStore.points + ''" :color="'primary'"></StatItem>
            </v-col>
          </v-row>
        </v-col>
      </v-row>

      <v-row>
        <v-col>
          <v-container class="my-5">

            <v-row v-if="!finishedForFirstTime" class="mt-10">
              <v-col md="6" order="1" order-md="1">
                <div class="text-h4 text-center">Neue Punktzahl</div>
              </v-col>
              <v-col md="6" order="3" order-md="2">
                <div class="text-h4 text-center">Punktzahl beim ersten Durchlauf</div>
              </v-col>

              <v-col md="6" order="2" order-md="3" class="d-flex align-center justify-center">
                <ScoreItem v-if="currentLesson && newScore !== undefined" :score="newScore"
                           :max-score="currentLesson?.points"></ScoreItem>
              </v-col>
              <v-col md="6" order="4" order-md="4" class="d-flex align-center justify-center">
                <ScoreItem v-if="currentLesson && userScore !== undefined" :score="userScore"
                           :max-score="currentLesson?.points"></ScoreItem>
              </v-col>
            </v-row>

            <v-row v-if="finishedForFirstTime" class="mt-10">
              <v-col>
                <div class="text-h4 text-center">Punktzahl</div>
              </v-col>
              <v-col class="d-flex align-center justify-center">
                <ScoreItem v-if="currentLesson && userScore !== undefined" :score="userScore"
                           :max-score="currentLesson?.points"></ScoreItem>
              </v-col>
            </v-row>

            <v-row class="mt-10">
              <v-col>
                <FeedbackItem :color="'info'" :new-score="newScore"></FeedbackItem>
              </v-col>
            </v-row>
          </v-container>
        </v-col>
      </v-row>

    </v-container>

    <v-divider></v-divider>

    <v-row class="mt-4">
      <v-col>
        <LessonQuestions :components="lessonStore.getComponents"></LessonQuestions>
      </v-col>
    </v-row>
  </div>
</template>
