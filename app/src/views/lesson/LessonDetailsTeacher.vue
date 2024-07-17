<template>
  <v-row justify="space-between" align="center">
    <v-col cols="auto" class="text-h4">
      {{ currentLesson?.lessonDTO.title }} -
      {{ currentLesson?.lessonDTO.points }}
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
  <v-row>
    <v-col cols="auto" class="d-flex justify-start align-center flex-wrap">
      <div v-for="objective in currentLesson?.objectives" v-if="currentLesson && currentLesson.objectives?.length > 0">
        <v-tooltip location="top" v-if="objective.description" :text="objective.description">
          <template v-slot:activator="{ props }">
            <v-chip
                v-bind="props"
                class="ma-5"
                prepend-icon="mdi-trophy"
                elevation="8"
            >
              {{ objective.name }}
            </v-chip>
          </template>
        </v-tooltip>
      </div>
    </v-col>
  </v-row>
  <v-row align="center" no-gutters>
    <v-col cols="11" class="text-h5">
      {{ currentLesson?.lessonDTO.description }}
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
                  <Score :show-icon="true" :score="avgScore" :max-score="maxScore"></Score>
                </v-col>
                <v-col md="6" order="3" order-md="2" class="d-flex align-center justify-center">
                  <Score :show-icon="false" :score="finishedCounter" :max-score="studentCount"></Score>
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

import {LessonModuleEntry, useLessonStore} from "@/stores/lesson.ts";
import LessonQuestions from "@/components/lesson/generator/LessonQuestions.vue";
import {Lesson, LessonStatistic} from "@/types/lesson.ts";
import Score from "@/components/lesson/results/Score.vue";
import {ref, watch} from "vue";

const lessonStore = useLessonStore();
const currentLesson: Lesson | null = lessonStore.getCurrentLesson;

const avgScore = ref<number>(0);
const stats = ref<any>();
const studentCount = ref<number>(0);
const maxScore = ref<number>(0);
let finishedCounter = 0;

const filters = ref<string[]>([]);

const notEnoughData = ref<boolean>(false);

init();

async function init() {
  if (currentLesson?.lessonDTO) {
    const data = await lessonStore.getCountOfStudentsForTeacher();
    if (data) studentCount.value = data;

    if (studentCount.value < 1) {
      notEnoughData.value = true;
    } else {
      stats.value = await lessonStore.getLessonStatistics(currentLesson.lessonDTO.uuid);

      if (stats.value) {
        maxScore.value = currentLesson.lessonDTO.points ? currentLesson.lessonDTO.points : 0;

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

const components = ref<LessonModuleEntry[]>([]);
components.value = lessonStore.getLessonModules;

watch(filters, async (newShowSolutions) => {
  components.value = []
  if (filters.value.includes('showSolutions') && currentLesson?.lessonDTO) {
    await lessonStore.loadQuestionsWithSolutionsForLesson(currentLesson.lessonDTO.uuid);
    components.value = lessonStore.getLessonModules;
  }
  if (!filters.value.includes('showSolutions') && currentLesson?.lessonDTO) {
    await lessonStore.fetchQuestionsForLesson(currentLesson.lessonDTO.uuid);
    components.value = lessonStore.getLessonModules;
  }
}, {deep: true});

</script>