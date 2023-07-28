<template>

  <div v-if="!currentLesson">
    <p>Loading Lesson...</p>
  </div>

  <div v-else>
    <h1>{{ currentLesson.title }}</h1>
  </div>

  <div v-if="currentQuestions.length <= 0">
    <p>No questions yet!</p>
  </div>

  <div v-else>
    <MultipleChoice v-for="question in currentQuestions" :question=question
    ></MultipleChoice>
  </div>

</template>

<script setup lang="ts">

import MultipleChoice from "@/components/MultipleChoice.component.vue";
import {useLessonStore} from "@/stores/lesson.store";
import {useRoute, useRouter} from "vue-router";
import {storeToRefs} from 'pinia'

const router = useRouter();
const route = useRoute();

const lessonId = route.params.lessonId.toString();
const lessonStore = useLessonStore();

const {currentLesson, currentQuestions} = storeToRefs(lessonStore)

lessonStore.fetchLessonById(lessonId);
lessonStore.fetchQuestionsForLesson(lessonId);

</script>
  