<script setup lang="ts">

  import LessonBuilder from "@/components/lesson/lessonBuilder/LessonBuilder.component.vue";
  import {HTML5Backend} from "react-dnd-html5-backend";
  import {DndProvider} from "vue3-dnd";

</script>

<template>
  <h1>Neue Lektion erstellen</h1>
  <v-divider></v-divider>
  <DndProvider :backend="HTML5Backend">
    <v-container>
      <LessonBuilder/>
    </v-container>
  </DndProvider>
</template>