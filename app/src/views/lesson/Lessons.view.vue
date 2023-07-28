<template>
  <h1>Alle Lektionen</h1>

  <div>
    <div v-if="!lessonStore.lessons.length">
      <p>Loading Lessons...</p>
    </div>

    <ul>
      <li v-for="lesson in lessons">
        <router-link :to="{ name: 'LessonDetails', params: { lessonId: lesson.id } }">
          {{ lesson.title }}
          {{ lesson.description }}
        </router-link>
      </li>
    </ul>
  </div>

</template>

<script setup lang="ts">

import {useLessonStore} from "@/stores/lesson.store";

const lessonStore = useLessonStore();
const lessons = lessonStore.lessons;

</script>
  