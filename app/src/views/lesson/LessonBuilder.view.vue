<script setup lang="ts">

  import LessonBuilder from "@/components/lesson/lessonBuilder/LessonBuilder.component.vue";
  import {HTML5Backend} from "react-dnd-html5-backend";
  import {DndProvider} from "vue3-dnd";
  import {useLessonFormStore} from "@/stores/lessonForm.store.ts";

  const lessonFormStore = useLessonFormStore();

</script>

<template>
  <h1 v-if="!lessonFormStore.isDirty">Neue Lektion erstellen</h1>
  <h1 v-else>Lektion bearbeiten</h1>
  <v-divider></v-divider>
  <DndProvider :backend="HTML5Backend">
    <v-container>
      <LessonBuilder/>
    </v-container>
  </DndProvider>
</template>