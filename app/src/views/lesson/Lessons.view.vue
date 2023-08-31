<template>
  <v-container>
    <h1>Alle Lektionen</h1>

    <div>
      <div v-if="!lessonStore.lessons.length">
        <p>Looking for lessons...</p>
      </div>

      <div v-else>
        <ul>
          <li v-for="lesson in lessons">
            <v-row>
              <v-col md="8">
                <router-link :to="{ name: 'LessonDetails', params: { lessonId: lesson.id } }">
                  {{ lesson.title }}
                  {{ lesson.description }}
                </router-link>
              </v-col>
              <v-col md="4">
                <v-btn :to="{ name: 'LessonForm', params: { lessonId: lesson.id } }">Add Question</v-btn>
              </v-col>
            </v-row>
          </li>
        </ul>
      </div>
    </div>
  </v-container>
</template>

<script setup lang="ts">

import {useLessonStore} from "@/stores/lesson.store";

const lessonStore = useLessonStore();
const lessons = lessonStore.lessons;

</script>
  