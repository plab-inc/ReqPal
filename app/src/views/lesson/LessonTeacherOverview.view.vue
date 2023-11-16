<template>
  <v-container>
    <v-container>
      <v-row>
        <v-col md="9">
          <div class="text-h3">Übersicht</div>
          <div class="text-h3 mt-4">{{ currentLesson?.title }}</div>
          <div class="text-h5 mt-4">{{ currentLesson?.description }}</div>
        </v-col>
        <v-col md="3">
          <v-row>
            <v-col>
              <StatItem :text="currentLesson?.points + ''" :color="'primary'"></StatItem>
            </v-col>
          </v-row>
        </v-col>
      </v-row>

      <v-row>
        <v-col>
          <LessonStatsOverview class="my-5"></LessonStatsOverview>
        </v-col>
      </v-row>

      <v-row>
        <v-col class="d-flex justify-end my-2">
          <div>
            <v-switch v-model="showSolutions" label="Lösungen"></v-switch>
          </div>
        </v-col>
      </v-row>
    </v-container>

    <v-divider></v-divider>

    <v-row class="mt-4">
      <v-col>
        <v-col md="9">
          <div class="text-h3">Lektion Vorschau</div>
        </v-col>
        <LessonQuestions :components="components"></LessonQuestions>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">

import {ComponentEntry, useLessonStore} from "@/stores/lesson.store.ts";
import LessonQuestions from "@/components/lesson/lessonGenerator/LessonQuestions.component.vue";
import LessonStatsOverview from "@/components/lesson/lessonTeacherOverview/LessonStatsOverview.component.vue";
import StatItem from "@/components/lesson/lessonResults/StatItem.component.vue";

const lessonStore = useLessonStore();
const currentLesson = lessonStore.getCurrentLesson?.lessonDTO;
const showSolutions = ref<boolean>(false);
const components = ref<ComponentEntry[]>([]);
components.value = lessonStore.getComponents;

watch(showSolutions, async (newShowSolutions) => {
  components.value = []
  if (newShowSolutions && currentLesson) {
    await lessonStore.loadQuestionsWithSolutionsForLesson(currentLesson.uuid);
    components.value = lessonStore.getComponents;
  } else if (!newShowSolutions && currentLesson) {
    await lessonStore.fetchQuestionsForLesson(currentLesson.uuid);
    components.value = lessonStore.getComponents;
  }
}, {deep: true});

</script>