<script setup lang="ts">

import LessonBuilder from "@/components/lesson/lessonBuilder/LessonBuilder.component.vue";
import {HTML5Backend} from "react-dnd-html5-backend";
import {DndProvider} from "vue3-dnd";
import {useLessonFormStore} from "@/stores/lessonForm.store.ts";

const lessonFormStore = useLessonFormStore();

</script>

<template>
  <v-row justify="space-between" align="center" class="mb-1">
    <v-col cols="auto" class="text-h4">
      {{ lessonFormStore.isDirty ? 'Lektion bearbeiten' : 'Neue Lektion erstellen' }}
    </v-col>
  </v-row>
  <v-divider></v-divider>
  <DndProvider :backend="HTML5Backend">
    <v-container>
      <LessonBuilder/>
    </v-container>
  </DndProvider>
</template>