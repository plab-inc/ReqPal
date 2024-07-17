<template>
  <v-row justify="space-between" align="center" class="mb-1">
    <v-col v-if="authStore.isTeacher" cols="auto" class="text-h4">
      Meine Lektionen ({{
        lessons.length
      }}/{{ MAX_LESSONS }})
    </v-col>
    <v-col cols="auto">
      <v-btn-group
          elevation="3"
          variant="outlined"
          rounded
          divided
      >
        <v-tooltip location="bottom" text="Neue Lektion im Builder erstellen">
          <template v-slot:activator="{ props }">
            <v-btn
                v-bind="props"
                v-if="authStore.isTeacher"
                color="primary"
                @click="router.push({path: '/builder'})"
                :disabled="lessons.length >= MAX_LESSONS"
            >
              Neue Lektion erstellen
            </v-btn>
          </template>
        </v-tooltip>
        <v-btn-toggle
            v-if="authStore.isTeacher"
            elevation="3"
            v-model="filters"
            variant="outlined"
            rounded
            multiple
            divided
            color="warning"
            group
        >
          <v-btn
              value="showExample"
          >
            Beispiel verbergen
          </v-btn>
          <v-btn
              v-if="authStore.isModerator"
              value="showOnlyOwn"
          >
            Nur Eigene Lektionen
          </v-btn>
        </v-btn-toggle>
      </v-btn-group>
    </v-col>
  </v-row>
  <v-divider></v-divider>
  <v-row no-gutters>
    <v-col v-if="authStore.isTeacher && !filters.includes('showExample')">
      <v-list>
        <v-list-item
            v-for="lesson in examples"
            :key="lesson.lessonDTO.uuid"
            @click="openLessonDetails(lesson)"
            border
            variant="outlined"
            rounded
            base-color="info"
            min-height="80px"
            ripple
            elevation="7"
            class="ma-5"
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
                v-if="authStore.isTeacher"
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
      <v-divider/>
    </v-col>

    <v-col cols="12">
      <LessonTable :filters="filters"></LessonTable>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">

import {useLessonStore} from "@/stores/lesson.ts";
import router from "@/router";
import {useAuthStore} from "@/stores/auth.ts";
import {useLessonFormStore} from "@/stores/lessonForm.ts";
import lessonService from "@/services/database/lesson.ts";
import {Lesson} from "@/types/lesson.ts";
import {v4 as uuidv4} from "uuid";
import {ref} from "vue";
import LessonTable from "@/components/lesson/LessonTable.vue";

const lessonStore = useLessonStore();
const lessonFormStore = useLessonFormStore();
const authStore = useAuthStore();
const filters = ref<string[]>([]);
const MAX_LESSONS = 20;
const examples: Lesson[] = lessonStore.getExampleLessons;
const lessons: Lesson[] = lessonStore.getLessons;

async function editLesson(lessonUUID: string) {
  await lessonService.pull.getLesson(lessonUUID).then((lesson) => {
    if (lesson) {
      lessonFormStore.hydrate(lesson);
      router.push({path: '/builder'});
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
      router.push({path: '/builder'});
    }
  });
}

async function openLessonDetails(lesson: Lesson) {
  if (authStore.isTeacher) {
    await router.push({name: 'LessonTeacherOverview', params: {lessonUUID: lesson.lessonDTO.uuid}});
  } else if (lesson.isFinished && !lesson.isStarted) {
    await router.push({name: 'LessonResults', params: {lessonUUID: lesson.lessonDTO.uuid}});
  } else {
    await router.push({name: 'LessonDetails', params: {lessonUUID: lesson.lessonDTO.uuid}});
  }
}

</script>
