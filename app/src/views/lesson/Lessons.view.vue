<template>
  <v-container>
    <div class="text-md-h3 text-sm-h4 text-h6">Alle Lektionen</div>

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
            <template v-slot:append>
              <v-btn :to="{ name: 'LessonForm', params: { lessonId: lesson.id } }">Frage hinzufügen</v-btn>
            </template>
          </v-list-item>
        </v-list>
      </div>
    </div>
    <component v-for="component in componentsList" :is="component"></component>
  </v-container>
</template>

<script setup lang="ts">

import {useLessonStore} from "@/stores/lesson.store";

const lessonStore = useLessonStore();
const lessons = lessonStore.lessons;

const componentsList = ref(['MultipleChoiceForm', 'MultipleChoiceForm']);

</script>
  