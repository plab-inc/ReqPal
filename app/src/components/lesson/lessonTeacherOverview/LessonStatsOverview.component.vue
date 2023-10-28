<script setup lang="ts">
import {useLessonStore} from "@/stores/lesson.store.ts";
import {LessonStatistic} from "@/types/lesson.types.ts";
import ScoreItem from "@/components/lesson/lessonResults/ScoreItem.component.vue";

const lessonStore = useLessonStore();
const currentLesson = lessonStore.getCurrentLesson?.lessonDTO;

const avgScore = ref<number>(0);
const stats = ref<any>();
const studentCount = ref<number>(0);
const maxScore = ref<number>(0);
let finishedCounter = 0;

const notEnoughData = ref<boolean>(false);

init();

async function init() {
  if (currentLesson) {
    const data = await lessonStore.getCountOfStudentsForTeacher();
    if (data) studentCount.value = data;

    if (studentCount.value === 0) {
      notEnoughData.value = true;
    } else {
      stats.value = await lessonStore.getLessonStatistics(currentLesson.uuid);
      maxScore.value = currentLesson.points;

      let allPoints = 0;

      stats.value.forEach((s: LessonStatistic) => {
        allPoints += s.user_points;
        finishedCounter++;
      })

      if (finishedCounter > 0 && studentCount.value > 0) {
        avgScore.value = allPoints / studentCount.value;
        avgScore.value = 50;
      }
    }
  }
}
</script>

<template>
  <v-expansion-panels>
    <v-expansion-panel>
      <v-expansion-panel-title>
        <div class="text-h5">Statistiken</div>
      </v-expansion-panel-title>
      <v-expansion-panel-text>
        <v-row v-if="notEnoughData" class="my-10">
          <v-col>
            <div class="text-h4 text-center">Nicht genügend Daten.</div>
          </v-col>
        </v-row>

        <v-row v-else class="mt-10">
          <v-col md="6" order="2" order-md="1" class="d-flex align-center justify-center">
            <ScoreItem :score="avgScore" :max-score="maxScore"></ScoreItem>
          </v-col>
          <v-col md="6" order="3" order-md="2" class="d-flex align-center justify-center">
            <ScoreItem :score="finishedCounter" :max-score="studentCount"></ScoreItem>
          </v-col>
          <v-col md="6" order="1" order-md="3">
            <div class="text-h4 text-center">Durchschnittlich erreichte Punkte</div>
          </v-col>
          <v-col md="6" order="2" order-md="4">
            <div class="text-h4 text-center">Durchschnittlich abgeschlossen</div>
          </v-col>
        </v-row>
      </v-expansion-panel-text>
    </v-expansion-panel>
  </v-expansion-panels>
</template>

<style scoped>

</style>