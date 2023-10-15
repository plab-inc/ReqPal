<template>
  <v-container>
    <div>
      <div class="text-md-h3 text-sm-h4 text-h6">{{ currentLesson?.title }}</div>
    </div>

    <div v-if="currentQuestions.length <= 0">
      <div class="text-subtitle-1">Noch keine Fragen!</div>
    </div>

    <div v-if="currentLesson">
      <LessonRequirements :lesson="currentLesson"></LessonRequirements>
    </div>

    <div v-if="currentQuestions.length > 0">

    </div>
  </v-container>
</template>

<script setup lang="ts">

import {useLessonStore} from "@/stores/lesson.store";
import {storeToRefs} from 'pinia'
import LessonRequirements from "@/components/catalog/LessonRequirements.component.vue";

const lessonStore = useLessonStore();
const {currentLesson, currentQuestions} = storeToRefs(lessonStore)
const multipleChoiceQuestions = computed(() => lessonStore.getMultipleChoiceQuestions);
const trueOrFalseQuestions = computed(() => lessonStore.getTrueOrFalseQuestions);
const sortableQuestions = computed(() => lessonStore.getSortableQuestions);
</script>