<template>
  <h1>Meine Lektionen</h1>
  <v-divider></v-divider>
  <v-container>
    <div>
      <div v-if="!lessonStore.lessons.length">
        <div class="text-subtitle-1">Keine Lektionen!</div>
      </div>

      <div v-else>
        <v-list dense>
          <v-list-item
              v-for="lesson in lessons"
              :key="lesson.id"
              :to="{ name: 'LessonDetails', params: { lessonId: lesson.id } }"
          >
            <template v-slot:prepend>
              {{ lesson.title }}
            </template>
          </v-list-item>
        </v-list>
      </div>
    </div>
  </v-container>
</template>

<script setup lang="ts">

import {useLessonStore} from "@/stores/lesson.store";

const lessonStore = useLessonStore();

const lessons = lessonStore.getLessons;


</script>
  