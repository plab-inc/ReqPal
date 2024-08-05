<template>
  <v-row justify="space-between" align="center" class="mb-1">
    <v-col cols="auto" class="text-h4">
      Meine Lektionen ({{
        filters.includes('showOnlyOwn') ?
            filteredLessons.length : lessons.length
      }}/{{ lessonFormStore.MAX_LESSONS }})
    </v-col>
    <v-col cols="auto">
      <v-btn-group
          elevation="3"
          variant="outlined"
          rounded
          divided
      >
        <v-btn
          @click="router.push({path: '/lesson/builder'})"
          :disabled="lessons.length >= lessonFormStore.MAX_LESSONS"
        >
          Neue Lektion erstellen
        </v-btn>
      </v-btn-group>
    </v-col>
  </v-row>
  <v-divider />
  <v-row no-gutters>
    <v-col>
      <v-list>
        <v-list-item
            v-for="lesson in examples"
            :key="lesson.lessonDTO.uuid"
            @click="openLessonDetails(lesson)"
            border
            variant="outlined"
            rounded
            base-color="info"
            ripple
            elevation="7"
            class="ma-2"
            subtitle="Beispiellektion"
        >
          <v-list-item-title>{{ lesson.lessonDTO.title }}</v-list-item-title>
          <v-list-item-subtitle>{{ lesson.lessonDTO.description }}</v-list-item-subtitle>
          <template v-slot:prepend>
            <v-icon>
              mdi-clipboard-text
            </v-icon>
          </template>
          <template v-slot:append>
            <v-btn-group
                variant="outlined"
                elevation="24"
                divided
                density="default"
            >
              <v-btn
                  @click.stop="copyLesson(lesson.lessonDTO.uuid)"
                  color="primary"
              >
                Kopieren
              </v-btn>
              <v-btn v-if="authStore.isModerator"
                     @click.stop="editLesson(lesson.lessonDTO.uuid)"
                     color="primary"
              >
                Bearbeiten
              </v-btn>
            </v-btn-group>
          </template>
        </v-list-item>
      </v-list>
      <v-divider opacity="0.5" />
    </v-col>
    <v-col cols="12">
      <LessonTable :filters="filters"></LessonTable>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">

import { useLessonStore } from "@/stores/lesson.ts";
import router from "@/router";
import { useAuthStore } from "@/stores/auth.ts";
import { useLessonFormStore } from "@/stores/lessonForm.ts";
import lessonService from "@/services/database/lesson.ts";
import { Lesson } from "@/types/lesson.ts";
import { v4 as uuidv4 } from "uuid";
import { computed, ref } from "vue";
import LessonTable from "@/components/lesson/LessonTable.vue";

const lessonStore = useLessonStore();
const lessonFormStore = useLessonFormStore();
const authStore = useAuthStore();
const filters = ref<string[]>([]);
const examples: Lesson[] = lessonStore.getExampleLessons;
const lessons: Lesson[] = lessonStore.getLessons;

const filteredLessons = computed(() => {
  return lessons.filter(lesson =>
      lesson.lessonDTO.user_id === authStore.user?.id
  )
});

async function editLesson(lessonUUID: string) {
  await lessonService.pull.getLesson(lessonUUID).then((lesson) => {
    if (lesson) {
      lessonFormStore.hydrate(lesson);
      router.push({ path: "lesson/builder" });
    }
  });
}

async function copyLesson(lessonUUID: string) {
  await lessonService.pull.getLesson(lessonUUID).then((lesson) => {
    if (lesson) {
      lesson.uuid = uuidv4();
      lesson.questions.forEach((question) => {
        question.uuid = uuidv4();
      })
      lessonFormStore.hydrate(lesson);
      router.push({ path: "lesson/builder" });
    }
  });
}

async function openLessonDetails(lesson: Lesson) {
  await router.push({name: 'LessonTeacherOverview', params: {lessonUUID: lesson.lessonDTO.uuid}});
}
</script>
