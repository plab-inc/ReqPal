<script setup lang="ts">

import {useAuthStore} from "@/stores/auth.store.ts";
import {useLessonStore} from "@/stores/lesson.store.ts";
import {useProfileStore} from "@/stores/profile.store.ts";
import FeedbackItem from "@/components/lesson/lessonResults/FeedbackItem.component.vue";
import ScoreItem from "@/components/lesson/lessonResults/ScoreItem.component.vue";

const lessonStore = useLessonStore();
const currentLesson = lessonStore.getCurrentLesson?.lessonDTO;
const userScore = lessonStore.getCurrentLesson?.userScore;
const profileStore = useProfileStore();
const fullScore = ref<boolean>(false);

const newScore = ref<number>(0);
const finishedForFirstTime = ref<boolean>(true);

if (userScore && currentLesson) {
  fullScore.value = userScore >= currentLesson.points;
}

onBeforeMount(async () => {
  const authStore = useAuthStore();
  if (authStore.user && currentLesson) {
    await profileStore.fetchPoints(authStore.user.id);
    newScore.value = await lessonStore.getUserResultsForLesson(currentLesson.uuid);
    const data = await lessonStore.checkLessonFinishedForFirstTime(currentLesson.uuid);
    if (data !== null && data !== undefined) finishedForFirstTime.value = data;
  }
})
</script>

<template>
  <v-expansion-panels>
    <v-expansion-panel>
      <v-expansion-panel-title>
        <div class="text-h5">Ergebnisse</div>
      </v-expansion-panel-title>
      <v-expansion-panel-text>
        <v-row v-if="!finishedForFirstTime" class="mt-10">
          <v-col md="6" order="1" order-md="1">
            <div class="text-h4 text-center">Neue Punktzahl</div>
          </v-col>
          <v-col md="6" order="3" order-md="2">
            <div class="text-h4 text-center">Punktzahl beim ersten Durchlauf</div>
          </v-col>

          <v-col md="6" order="2" order-md="3" class="d-flex align-center justify-center">
            <ScoreItem v-if="currentLesson" :score="newScore" :max-score="currentLesson?.points"></ScoreItem>
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
            <ScoreItem v-if="currentLesson" :score="newScore" :max-score="currentLesson?.points"></ScoreItem>
          </v-col>
        </v-row>

        <v-row class="mt-10">
          <v-col>
            <FeedbackItem :color="'info'" :new-score="newScore"></FeedbackItem>
          </v-col>
        </v-row>
      </v-expansion-panel-text>
    </v-expansion-panel>
  </v-expansion-panels>
</template>

<style scoped>

</style>