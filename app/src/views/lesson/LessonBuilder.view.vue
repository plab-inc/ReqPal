<script setup lang="ts">
import LessonBuilder from "@/components/lesson/lessonBuilder/LessonBuilder.component.vue";
import {HTML5Backend} from "react-dnd-html5-backend";
import {DndProvider} from "vue3-dnd";
import {useLessonFormStore} from "@/stores/lessonForm.store.ts";

const lessonFormStore = useLessonFormStore();
const showToolTips = ref<boolean>(true);
</script>

<template>
  <v-row justify="space-between" align="center" class="mb-1">
    <v-col cols="auto" class="text-h4">
      {{ lessonFormStore.isDirty ? 'Lektion bearbeiten' : 'Neue Lektion erstellen' }}
    </v-col>
    <v-col cols="auto">
      <v-btn-toggle
          elevation="3"
          v-model="showToolTips"
          variant="outlined"
          rounded
          divided
          color="warning"
      >
        <v-btn
            :value="true"
        >
          Modulbeschreibungen anzeigen
        </v-btn>
      </v-btn-toggle>
    </v-col>
  </v-row>
  <v-divider></v-divider>
  <DndProvider :backend="HTML5Backend">
    <v-container>
      <LessonBuilder :show-tool-tip="showToolTips ? showToolTips : false"/>
    </v-container>
  </DndProvider>
</template>