<script setup lang="ts">
import LessonBuilder from "@/components/lesson/builder/LessonBuilder.vue";
import {HTML5Backend} from "react-dnd-html5-backend";
import {DndProvider} from "vue3-dnd";
import {useLessonFormStore} from "@/stores/lessonForm.ts";
import { ref } from "vue";

const lessonFormStore = useLessonFormStore();
const filters = ref<string[]>([]);
</script>

<template>
  <v-row justify="space-between" align="center" class="mb-1">
    <v-col cols="auto" class="text-h4">
      {{ lessonFormStore.isDirty ? 'Lektion bearbeiten' : 'Neue Lektion erstellen' }}
    </v-col>
    <v-col cols="auto">
      <v-btn-toggle
          elevation="3"
          v-model="filters"
          variant="outlined"
          rounded
          divided
          color="warning"
      >
        <v-tooltip text="Erklärungen an den Lektionsbausteinen als Tooltip">
          <template v-slot:activator="{ props }">
            <v-btn
                value="showToolTips"
                v-bind="props"
            >
              Lektionsbaustein Tooltip Anzeigen
            </v-btn>
          </template>
        </v-tooltip>

      </v-btn-toggle>
    </v-col>
  </v-row>
  <v-divider></v-divider>
  <DndProvider :backend="HTML5Backend">
    <v-container>
      <LessonBuilder :show-tool-tip="!!filters?.includes('showToolTips')"/>
    </v-container>
  </DndProvider>
</template>