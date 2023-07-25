<template>

  <div v-if="!lesson">
    <p>Loading Lesson...</p>
  </div>

  <h1>{{lesson?.title}}</h1>

  <div>
    <MultipleChoice v-for="question in questions"  :question=question
    ></MultipleChoice>
  </div>

</template>
  
<script setup lang="ts">

import MultipleChoice from "@/components/MultipleChoice.component.vue";
import {useLessonStore} from "@/stores/lesson.store";
import {useRoute, useRouter} from "vue-router";

const router = useRouter();
const route = useRoute();

const lessonId = route.params.lessonId.toString();

const lessonStore = useLessonStore();
lessonStore.fetchLessonById(lessonId);
const lesson = lessonStore.currentLesson;
lessonStore.fetchQuestionsForLesson(lessonId);
const questions = lessonStore.getAllQuestions;

</script>
  