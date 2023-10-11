<template>
  <v-container>
    <h1>Alle Lektionen</h1>

    <div>
      <div v-if="!lessonStore.lessons.length">
        <p>Looking for lessons...</p>
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
                <v-btn :to="{ name: 'LessonForm', params: { lessonId: lesson.id } }">Add Question</v-btn>
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
import MultipleChoiceForm from "@/components/MultipleChoice/MultipleChoiceForm.component.vue";

const lessonStore = useLessonStore();
const lessons = lessonStore.lessons;

const componentsList = ref(['MultipleChoiceForm', 'MultipleChoiceForm']);

</script>
  