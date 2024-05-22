<script setup lang="ts">

import {useLessonStore} from "@/stores/lesson.ts";
import {useProfileStore} from "@/stores/profile.ts";
import {useAuthStore} from "@/stores/auth.ts";
import LessonQuestions from "@/components/lesson/generator/LessonQuestions.vue";
import AlertService from "@/services/util/alert.ts";
import Feedback from "@/components/lesson/results/Feedback.vue";
import Score from "@/components/lesson/results/Score.vue";

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

  <v-row justify="space-between" align="center">
    <v-col cols="10" class="text-h4">
      {{ currentLesson?.title }}
    </v-col>
    <v-col cols="auto" class="text-h4" align-self="center">
      {{ newScore }}/{{ currentLesson?.points }}
      <v-icon class="mb-1" size="35" color="warning" :icon="'mdi-star-four-points-circle-outline'"></v-icon>
    </v-col>
  </v-row>
  <v-row align="center" no-gutters>
    <v-col cols="11" class="text-h5">
      {{ currentLesson?.description }}
    </v-col>
  </v-row>
  <v-divider/>


  <v-container v-if="!isFinished">
    <div class="text-h2">Diese Lektion wurde noch nicht bearbeitet!</div>
  </v-container>

  <v-container v-if="isFinished">
    <v-row>
      <v-col>
        <v-expansion-panels>
          <v-expansion-panel>
            <v-expansion-panel-title class="text-h5">
              Meine Statistiken
            </v-expansion-panel-title>
            <v-expansion-panel-text>
              <v-container>
                <v-row class="mt-1" v-if="!finishedForFirstTime">
                  <v-col md="6" order="2" order-md="1" class="d-flex justify-center">
                    <Score v-if="currentLesson && newScore !== undefined" :score="newScore" :show-icon="false"
                           :max-score="currentLesson?.points ? currentLesson?.points : 0"></Score>
                  </v-col>
                  <v-col md="6" order="3" order-md="2" class="d-flex align-center justify-center">
                    <Score v-if="currentLesson && userScore !== undefined" :score="userScore" :show-icon="true"
                           :max-score="currentLesson?.points ? currentLesson?.points : 0"></Score>
                  </v-col>
                  <v-col md="6" order="1" order-md="3" class="text-h5 text-center">
                    Neue Punktzahl
                  </v-col>
                  <v-col md="6" order="2" order-md="4" class="text-h5 text-center">
                    Punktzahl beim ersten Durchlauf
                  </v-col>
                </v-row>

                <v-row v-if="finishedForFirstTime">
                  <v-col class="d-flex align-center justify-center">
                    <Score v-if="currentLesson && userScore !== undefined" :score="userScore" :show-icon="true"
                           :max-score="currentLesson?.points ? currentLesson?.points : 0"></Score>
                  </v-col>
                  <v-col class="text-h5 text-center">
                    Erreichte Punkte
                  </v-col>
                </v-row>

                <v-row class="mt-5" justify="center" no-gutters>
                  <v-col cols="12">
                    <Feedback :color="'info'" :new-score="newScore"></Feedback>
                  </v-col>
                </v-row>
              </v-container>
            </v-expansion-panel-text>
          </v-expansion-panel>
        </v-expansion-panels>
      </v-col>
    </v-row>
  </v-container>

  <v-divider></v-divider>

  <v-row>
    <v-col>
      <LessonQuestions :components="lessonStore.getLessonModules"></LessonQuestions>
    </v-col>
  </v-row>

</template>
