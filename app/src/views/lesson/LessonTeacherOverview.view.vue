<template>
  <v-row justify="space-between" align="center">
    <v-col cols="auto" class="text-h4">
      {{ currentLesson?.title }} -
      {{ currentLesson?.points }}
      <v-icon class="mb-1" size="35" color="warning" :icon="'mdi-star-four-points-circle-outline'"></v-icon>
    </v-col>
    <v-col cols="auto">
      <v-btn-toggle
          elevation="3"
          v-model="filters"
          variant="outlined"
          rounded
          multiple
          divided
          color="warning"
          group
      >
        <v-btn
            value="showSolutions"
        >
          {{ filters.includes('showSolutions') ? 'Vorschau anzeigen' : 'Lösungen anzeigen' }}
        </v-btn>
      </v-btn-toggle>
    </v-col>
  </v-row>
  <v-row align="center" no-gutters>
    <v-col cols="11" class="text-h5">
      {{ currentLesson?.description }}
    </v-col>
  </v-row>
  <v-divider/>
  <v-container>
    <v-row>
      <v-col>
        <v-expansion-panels>
          <v-expansion-panel>
            <v-expansion-panel-title>
              <div class="text-h5">Statistiken der Studenten</div>
            </v-expansion-panel-title>
            <v-expansion-panel-text>
              <v-row v-if="notEnoughData" class="my-10">
                <v-col>
                  <div class="text-h4 text-center">Nicht genügend Daten.</div>
                </v-col>
              </v-row>

              <v-row v-else class="mt-1">
                <v-col md="6" order="2" order-md="1" class="d-flex align-center justify-center">
                  <ScoreItem :show-icon="true" :score="avgScore" :max-score="maxScore"></ScoreItem>
                </v-col>
                <v-col md="6" order="3" order-md="2" class="d-flex align-center justify-center">
                  <ScoreItem :show-icon="false" :score="finishedCounter" :max-score="studentCount"></ScoreItem>
                </v-col>
                <v-col md="6" order="1" order-md="3" class="text-h5 text-center">
                  Durchschnittlich erreichte Punkte
                </v-col>
                <v-col md="6" order="2" order-md="4" class="text-h5 text-center">
                  Durchschnittlich abgeschlossen
                </v-col>
              </v-row>
            </v-expansion-panel-text>
          </v-expansion-panel>
        </v-expansion-panels>
      </v-col>
    </v-row>
  </v-container>
  <v-divider></v-divider>
  <v-row>
    <v-col>
      <LessonQuestions :components="components"></LessonQuestions>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">

import {ComponentEntry, useLessonStore} from "@/stores/lesson.store.ts";
import LessonQuestions from "@/components/lesson/lessonGenerator/LessonQuestions.component.vue";
import {LessonStatistic} from "@/types/lesson.types.ts";
import ScoreItem from "@/components/lesson/lessonResults/ScoreItem.component.vue";

const lessonStore = useLessonStore();
const currentLesson = lessonStore.getCurrentLesson?.lessonDTO;

const avgScore = ref<number>(0);
const stats = ref<any>();
const studentCount = ref<number>(0);
const maxScore = ref<number>(0);
let finishedCounter = 0;

const filters = ref<string[]>([]);

const notEnoughData = ref<boolean>(false);

init();

async function init() {
  if (currentLesson) {
    const data = await lessonStore.getCountOfStudentsForTeacher();
    if (data) studentCount.value = data;

    if (studentCount.value < 1) {
      notEnoughData.value = true;
    } else {
      stats.value = await lessonStore.getLessonStatistics(currentLesson.uuid);

      if (stats.value) {
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
      } else {
        notEnoughData.value = true;
      }
    }
  }
}

const components = ref<ComponentEntry[]>([]);
components.value = lessonStore.getComponents;

watch(filters, async (newShowSolutions) => {
  components.value = []
  if (filters.value.includes('showSolutions') && currentLesson) {
    await lessonStore.loadQuestionsWithSolutionsForLesson(currentLesson.uuid);
    components.value = lessonStore.getComponents;
  }
  if (!filters.value.includes('showSolutions') && currentLesson) {
    await lessonStore.fetchQuestionsForLesson(currentLesson.uuid);
    components.value = lessonStore.getComponents;
  }
}, {deep: true});

</script>