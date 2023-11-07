<template>
  <h1>Meine Lektionen ({{ lessons.length }}/20) </h1>
  <v-divider></v-divider>
  <v-container>
    <v-row no-gutters>
      <v-col cols="12" v-if="lessons.length < 1 ">
        <v-card
            :title="authStore.isTeacher ? 'Keine eigenen Lektionen verfügbar.' : 'Keine Lektionen verfügbar'"
            :subtitle="authStore.isTeacher ? 'Sie haben noch keine Lektionen erstellt' :'Ihr Dozent hat aktuell noch keine Lektionen erstellt und veröffentlicht.'"
            variant="outlined"
            color="error"
            elevation="12"
            class="mb-10"
        >
        </v-card>
      </v-col>

      <v-col cols="12" v-if="authStore.isTeacher">
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
              <v-badge
                  v-if="!authStore.isTeacher"
                  inline
                  color="error"
                  content="NEU">
              </v-badge>
              <v-btn-group
                  v-if="authStore.isTeacher"
                  variant="outlined"
                  elevation="24"
                  divided
                  density="default"
              >
                <v-btn
                    @click.stop="console.log('copy')"
                    color="primary"
                    disabled
                >
                  Kopieren
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
              v-for="lesson in lessons"
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
  </v-container>
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

const lessonStore = useLessonStore();
const lessonFormStore = useLessonFormStore();
const authStore = useAuthStore();

const lessons: Lesson[] = lessonStore.getLessons;
const examples: Lesson[] = lessonStore.getExampleLessons;

async function editLesson(lessonUUID: string) {
  await lessonService.pull.getLesson(lessonUUID).then((lesson) => {
    if (lesson) {
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

  if(authStore.isTeacher) {
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
      "Möchtest du die Lektion wirklich löschen? Das löschen is unwiederruflich",
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
