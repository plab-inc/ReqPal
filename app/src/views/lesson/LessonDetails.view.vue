<template>
  <v-container>
    <div>
      <div class="text-md-h3 text-sm-h4 text-h6">{{ currentLesson?.title }}</div>
    </div>

    <div v-if="currentQuestions.length <= 0">
      <div class="text-subtitle-1">Noch keine Fragen!</div>
    </div>

    <div v-if="currentQuestions.length > 0">

    </div>
  </v-container>
</template>

<script setup lang="ts">

import {useLessonStore} from "@/stores/lesson.store";
import {storeToRefs} from 'pinia'

const lessonStore = useLessonStore();
const {currentLesson, currentQuestions} = storeToRefs(lessonStore)
</script>