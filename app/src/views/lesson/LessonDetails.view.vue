<template>

  <div v-if="!dataLoaded">
    <p>Loading Lesson...</p>
  </div>

  <div v-else>
    <h1>{{ currentLesson?.title }}</h1>
  </div>

  <div v-if="dataLoaded && currentQuestions.length <= 0">
    <p>No questions yet!</p>
  </div>

  <div v-if="dataLoaded && currentQuestions.length > 0">
    <MultipleChoice v-for="question in currentQuestions" :key="question.id" :question="question"></MultipleChoice>
  </div>

</template>

<script setup lang="ts">

import MultipleChoice from "@/components/MultipleChoice.component.vue";
import { useLessonStore } from "@/stores/lesson.store";
import { useRoute } from "vue-router";
import { storeToRefs } from 'pinia'

const route = useRoute();

const lessonId = route.params.lessonId.toString();
const lessonStore = useLessonStore();

const { currentLesson, currentQuestions } = storeToRefs(lessonStore)

const dataLoaded = ref(false);

onBeforeMount(async () => {
  await lessonStore.fetchLessonById(lessonId);
  await lessonStore.fetchQuestionsForLesson(lessonId);
  dataLoaded.value = true;
})

</script>