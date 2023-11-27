<template>
  <v-row justify="space-between" align="center" class="mb-1">
    <v-col v-if="authStore.isTeacher" cols="auto" class="text-h4">
      Meine Lektionen ({{
        lessons.length
      }}/20)
    </v-col>
    <v-col v-else cols="auto" class="text-h4">
      Abgeschlossene Lektionen ({{
        lessons.filter(l => l.isFinished).length
      }}/{{ lessons.length }})
    </v-col>
    <v-col cols="auto">
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
            v-if="authStore.isModerator"
            value="showOnlyOwn"
        >
          Nur Eigene Lektionen
        </v-btn>
        <v-btn
            value="showExample"
        >
          Beispiel verbergen
        </v-btn>
      </v-btn-toggle>
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

    <v-col cols="12" v-if="true">
      <v-list>
        <v-list-item
            v-for="lesson in filteredLessons"
            :key="lesson.lessonDTO.uuid"
            @click="openLessonDetails(lesson)"
            border
            variant="outlined"
            rounded
            min-height="80px"
            ripple
            elevation="12"
            class="ma-5"
        >
          <v-list-item-title>{{ lesson.lessonDTO.title }}</v-list-item-title>
          <v-list-item-subtitle>{{ lesson.lessonDTO.description }}</v-list-item-subtitle>
          <template v-slot:prepend>
            <v-icon>
              mdi-clipboard-text
            </v-icon>
          </template>
          <template v-slot:append>
            <v-chip
                v-if="authStore.isModerator"
                class="mr-10 ma-5"
                :prepend-avatar="'avatars/' + lesson.creatorAvatar + '.png'"
                elevation="8"
            >
              {{ lesson.creatorUsername }}
            </v-chip>
            <LessonDetailsStudent v-if="!authStore.isTeacher" :lesson="lesson"></LessonDetailsStudent>
            <v-btn-group
                v-if="authStore.isTeacher"
                variant="outlined"
                elevation="24"
                divided
                density="default"
            >
              <v-btn
                  @click.stop="editLesson(lesson.lessonDTO.uuid)"
                  color="primary"
              >
                Bearbeiten
              </v-btn>
              <v-btn
                  color="info"
                  @click.stop="copyLesson(lesson.lessonDTO.uuid)"
              >
                Kopieren
              </v-btn>
              <v-btn
                  @click.stop="togglePublished(lesson.lessonDTO)"
                  :color="lesson.lessonDTO.published ? 'warning' : 'success'"
                  min-width="180px"
              >
                {{ lesson.lessonDTO.published ? 'Verbergen' : 'Veröffentlichen' }}
              </v-btn>
              <v-btn
                  @click.stop="openDeleteDialog(lesson.lessonDTO.uuid)"
                  color="error"
              >
                Löschen
              </v-btn>
            </v-btn-group>
          </template>
        </v-list-item>
      </v-list>
    </v-col>
  </v-row>
  <v-row>
    <v-col>
      <v-btn
          v-if="authStore.isTeacher"
          color="primary"
          @click="router.push({path: '/builder'})"
          block
          :disabled="lessons.length >= 20"
      >
        Neue Lektion erstellen
      </v-btn>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">

import {useLessonStore} from "@/stores/lesson.store";
import router from "@/router";
import {useAuthStore} from "@/stores/auth.store.ts";
import {useLessonFormStore} from "@/stores/lessonForm.store.ts";
import lessonService from "@/services/database/lesson.service.ts";
import alertService from "@/services/util/alert.service.ts";
import {Lesson, LessonDTO} from "@/types/lesson.types.ts";
import LessonDetailsStudent from "@/components/lesson/lessonGenerator/LessonDetailsStudent.component.vue";
import {v4 as uuidv4} from "uuid";

const lessonStore = useLessonStore();
const lessonFormStore = useLessonFormStore();
const authStore = useAuthStore();

const filters = ref<string[]>([]);

const examples: Lesson[] = lessonStore.getExampleLessons;
const lessons: Lesson[] = lessonStore.getLessons;

const filteredLessons = computed(() => {
  if (filters.value.includes('showOnlyOwn')) {
    return lessons.filter(lesson => lesson.creatorUsername === authStore.userMetadata.username);
  }
  return lessons;
});

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

function togglePublished(lesson: LessonDTO) {
  lessonService.push.togglePublished(lesson.uuid).then(() => {
    lesson.published = !lesson.published; //Trick in UI, damit Objekt nicht erneut geladen werden muss
  })
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

function openDeleteDialog(lessonUUID: string) {
  alertService.openDialog(
      "Lektion löschen",
      "Möchtest du die Lektion wirklich löschen? Das Löschen ist unwiderruflich",
      "Ja",
      "Nein",
      () => deleteLesson(lessonUUID)
  )
}

function deleteLesson(lessonUUID: string): void {
  lessonStore.deleteLesson(lessonUUID)
      .then(() => {
        alertService.addSuccessAlert("Lektion gelöscht")
      })
}

</script>
