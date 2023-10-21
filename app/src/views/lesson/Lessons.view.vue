<template>
  <h1>Meine Lektionen</h1>
  <v-divider></v-divider>
  <v-container>
        <v-row>
          <v-col>
            <v-list>
              <v-list-item
                  v-for="lesson in examples"
                  :key="lesson.uuid"
                  @click="openLessonDetails(lesson.uuid)"
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
                <v-list-item-title>{{ lesson.title }}</v-list-item-title>
                <v-list-item-subtitle>{{ lesson.description }}</v-list-item-subtitle>
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
            <v-list>
              <v-list-item
                  v-for="lesson in lessons"
                  :key="lesson.uuid"
                  @click="openLessonDetails(lesson.uuid)"
                  border
                  variant="outlined"
                  rounded
                  min-height="80px"
                  ripple
                  elevation="12"
                  class="ma-5"
              >
                <v-list-item-title>{{ lesson.title }}</v-list-item-title>
                <v-list-item-subtitle>{{ lesson.description }}</v-list-item-subtitle>
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
                        @click.stop="editLesson(lesson.uuid)"
                        color="primary"
                    >
                      Bearbeiten
                    </v-btn>
                    <v-btn
                        @click.stop="console.log('publish')"
                        color="success"
                    >
                      Veröffentlichen
                    </v-btn>
                    <v-btn
                        @click.stop="openDeleteDialog(lesson.uuid)"
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
            >
              Neue Lektion erstellen
            </v-btn>
          </v-col>
        </v-row>
  </v-container>
</template>

<script setup lang="ts">

import {useLessonStore} from "@/stores/lesson.store";
import router from "@/router/index.ts";
import {useAuthStore} from "@/stores/auth.store.ts";
import {useLessonFormStore} from "@/stores/lessonForm.store.ts";
import lessonService from "@/services/database/lesson.service.ts";
import alertService from "@/services/util/alert.service.ts";

const lessonStore = useLessonStore();
const lessonFormStore = useLessonFormStore();
const authStore = useAuthStore();

const lessons = lessonStore.getLessons;
const examples = lessonStore.getExampleLessons;

async function editLesson(lessonUUID: string) {
  await lessonService.pull.getLesson(lessonUUID).then((lesson) => {
    if(lesson){
      lessonFormStore.hydrate(lesson);
      router.push({path: '/builder'});
    }
  });
}

function openLessonDetails(lessonUUID: string) {
  router.push({ name: 'LessonDetails', params: { lessonUUID } });
}

function openDeleteDialog(lessonUUID: string) {
  alertService.openDialog(
      () => deleteLesson(lessonUUID),
      "Lektion löschen",
      "Möchtest du die Lektion wirklich löschen? Das löschen is unwiederruflich",
      "Ja",
      "Nein"
  )
}
function deleteLesson(lessonUUID: string): void {
  lessonStore.deleteLesson(lessonUUID)
      .then(() => {alertService.addSuccessAlert("Lektion gelöscht")})
}

</script>
