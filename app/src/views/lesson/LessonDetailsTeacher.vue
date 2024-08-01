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
  <v-row>
    <v-col>
      <LessonQuestions :components="components"></LessonQuestions>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">

import { LessonModuleEntry, useLessonStore } from "@/stores/lesson.ts";
import LessonQuestions from "@/components/lesson/generator/LessonQuestions.vue";
import { Lesson } from "@/types/lesson.ts";
import { ref, watch } from "vue";

const lessonStore = useLessonStore();
const currentLesson: Lesson | null = lessonStore.getCurrentLesson;

const filters = ref<string[]>([]);

const components = ref<LessonModuleEntry[]>([]);
components.value = lessonStore.getLessonModules;

watch(filters, async (newShowSolutions) => {
  components.value = []
  if (filters.value.includes('showSolutions') && currentLesson?.lessonDTO) {
    await lessonStore.loadQuestionsWithSolutionsForLesson(currentLesson.lessonDTO.uuid);
    components.value = lessonStore.getLessonModules;
  }
  if (!filters.value.includes('showSolutions') && currentLesson?.lessonDTO) {
    await lessonStore.fetchQuestionsWithLesson(currentLesson.lessonDTO.uuid);
    components.value = lessonStore.getLessonModules;
  }
}, {deep: true});

</script>