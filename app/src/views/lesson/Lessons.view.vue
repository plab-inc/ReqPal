<template>
  <h1>Meine Lektionen</h1>
  <v-divider></v-divider>
  <v-container>
    <div>
      <div v-if="!lessonStore.lessons.length">
        <div class="text-subtitle-1">Keine Lektionen!</div>
      </div>
      <div v-else>
        <v-row>
          <v-col>
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
                        @click.stop="console.log('delete')"
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
      </div>
    </div>
  </v-container>
</template>

<script setup lang="ts">

import {useLessonStore} from "@/stores/lesson.store";
import router from "@/router/index.ts";
import {useAuthStore} from "@/stores/auth.store.ts";
import {useLessonFormStore} from "@/stores/lessonForm.store.ts";
import lessonService from "@/services/database/lesson.service.ts";

const lessonStore = useLessonStore();
const lessonFormStore = useLessonFormStore();
const authStore = useAuthStore();

const lessons = lessonStore.getLessons;

async function editLesson(lessonUUID: string) {

  await lessonService.pull.getLesson(lessonUUID).then((lesson) => {
    if(lesson){
      lessonFormStore.hydrate(lesson);
      router.push({path: '/builder'});
    }
  });
}

function openLessonDetails(lessonUUID: string) {
  console.log(lessonUUID)
  router.push({ name: 'LessonDetails', params: { lessonUUID } });
}

</script>
