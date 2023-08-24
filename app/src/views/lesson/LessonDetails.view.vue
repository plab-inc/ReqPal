<template>
  <v-container>
    <div>
      <h1>{{ currentLesson?.title }}</h1>
    </div>

    <div v-if="currentQuestions.length <= 0">
      <p>No questions yet!</p>
    </div>

    <div v-if="currentQuestions.length > 0">
      <MultipleChoice v-for="question in multipleChoiceQuestions" :key="question.id"
                      :question="question"></MultipleChoice>
      <TrueOrFalse v-for="question in trueOrFalseQuestions" :key="question.id" :question="question"></TrueOrFalse>
    </div>
  </v-container>
</template>

<script setup lang="ts">

import MultipleChoice from "@/components/MultipleChoice.component.vue";
import TrueOrFalse from "@/components/TrueOrFalse.component.vue";
import {useLessonStore} from "@/stores/lesson.store";
import {storeToRefs} from 'pinia'

const lessonStore = useLessonStore();
const {currentLesson, currentQuestions} = storeToRefs(lessonStore)
const multipleChoiceQuestions = computed(() => lessonStore.getMultipleChoiceQuestions);
const trueOrFalseQuestions = computed(() => lessonStore.getTrueOrFalseQuestions);
</script>