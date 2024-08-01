<script setup lang="ts">
import LessonBuilder from "@/components/lesson/builder/LessonBuilder.vue";
import { HTML5Backend } from "react-dnd-html5-backend";
import { DndProvider } from "vue3-dnd";
import { useLessonFormStore } from "@/stores/lessonForm.ts";

const lessonFormStore = useLessonFormStore();
</script>

<template>
  <v-row justify="space-between" align="center" class="mb-1">
    <v-col cols="auto" class="text-h4">
      {{ lessonFormStore.isDirty ? "Lektion bearbeiten" : "Neue Lektion erstellen" }}
    </v-col>
    <v-col cols="auto">
      <v-btn-group elevation="3" variant="outlined" rounded divided>
        <v-btn
          color="success"
          text="Lektion Speichern"
          @click="lessonFormStore.saveLesson()"
        />
        <v-btn
          color="info"
          text="Lektion Validieren"
          @click="lessonFormStore.isFormValid()"
        />
        <v-btn
          color="error"
          text="Lektion zurücksetzen"
          @click="lessonFormStore.flushStore()"
        />
        <v-btn
          color="warning"
          text="Bausteine zurücksetzen"
          @click="lessonFormStore.clearLessonModules()"
        />
      </v-btn-group>
    </v-col>
  </v-row>
  <v-divider />
  <DndProvider :backend="HTML5Backend">
    <v-container>
      <LessonBuilder />
    </v-container>
  </DndProvider>
</template>