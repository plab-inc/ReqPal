<script setup lang="ts">

import {useLessonStore} from "@/stores/lesson.store.ts";

interface Props {
  color: string
}

const lessonStore = useLessonStore();
const userScore = lessonStore.getCurrentLesson?.userScore;
const newScore = ref<number>(0);
const currentLesson = lessonStore.getCurrentLesson?.lessonDTO;
const finishedForFirstTime = ref<boolean>(true);

const props = defineProps<Props>()
const feedback = ref<string>('');

function init() {
  if (!finishedForFirstTime.value) {
    if (userScore !== undefined && currentLesson) {
      if (newScore.value > userScore) {
        feedback.value = 'Sie haben sich verbessert! Gut gemacht!';
      } else if (newScore.value < userScore) {
        feedback.value = 'Das war nicht so gut wie zuvor. Übung macht den Meister!';
      } else if (newScore.value === userScore && userScore === currentLesson.points) {
        feedback.value = 'Perfekte Punktzahl beibehalten! Fantastische Arbeit!';
      } else if (newScore.value === userScore) {
        feedback.value = 'Sie haben Ihre Ergebnisse gut gehalten! Da ist noch Luft nach oben!';
      }
    }
  } else {
    if (currentLesson) {
      if (newScore.value >= currentLesson.points) {
        feedback.value = 'Perfekte Punktzahl! Fantastische Arbeit!';
      } else if (newScore.value >= currentLesson.points / 2) {
        feedback.value = 'Sie sind auf einem guten Weg! Weiter so!';
      } else if (newScore.value < currentLesson.points / 2) {
        feedback.value = 'Das ist ein guter Start, aber da geht noch mehr. Übung macht den Meister!';
      }
    }
  }
}

onBeforeMount(async () => {
  if (currentLesson) {
    const data = await lessonStore.checkLessonFinishedForFirstTime(currentLesson.uuid);
    if (data !== null && data !== undefined) finishedForFirstTime.value = data;
    newScore.value = await lessonStore.getUserResultsForLesson(currentLesson.uuid);
  }
  init();
})
</script>

<template>

  <v-sheet
      :elevation="9"
      :min-height="150"
      :min-width="150"
      :color="color"
      rounded
      class="d-flex align-center justify-center flex-wrap text-center"
  >
    <div class="text-h6 text-sm-h4 text-md-h5 text-lg-h4">
      {{ feedback }}
    </div>

  </v-sheet>

</template>

<style scoped>

</style>