<script setup lang="ts">

import {Lesson} from "@/types/lesson.types.ts";
import alertService from "@/services/util/alert.service.ts";
import router from "@/router";
import AlertService from "@/services/util/alert.service.ts";
import {useLessonStore} from "@/stores/lesson.store.ts";

interface Props {
  lesson: Lesson
}

const props = defineProps<Props>();
const lessonStore = useLessonStore();

async function resetLesson() {
  if (lessonStore.currentLesson) {
    try {
      await lessonStore.restartLessonForUser(lessonStore.currentLesson.lessonDTO.uuid);
      AlertService.addSuccessAlert('Lektion erfolgreich zurückgesetzt!')
      await router.push({name: 'LessonDetails', params: {lessonUUID: lessonStore.currentLesson.lessonDTO.uuid}});
    } catch (error: any) {
      AlertService.addErrorAlert("Fehler beim Zurücksetzen: " + error.message);
    }
  }
}

async function resetProgress() {
  if (lessonStore.currentLesson) {
    try {
      await lessonStore.restartLessonProgressForUser(lessonStore.currentLesson.lessonDTO.uuid);
      AlertService.addSuccessAlert('Fortschritt erfolgreich zurückgesetzt!')
      await router.push({name: 'LessonDetails', params: {lessonUUID: lessonStore.currentLesson.lessonDTO.uuid}});
    } catch (error: any) {
      AlertService.addErrorAlert("Fehler beim Zurücksetzen: " + error.message);
    }
  }
}

function openDialog() {
  alertService.openDialog('Fortschritt zurücksetzen', 'Hierdurch wird der gesamte Fortschritt der Lektion gelöscht ' +
      'und Sie müssen Sie von vorne beginnen.', 'Zurücksetzen', 'Abbrechen', resetProgress);
}
</script>

<template>
  <div class="d-flex align-center justify-end">
    <div v-if="lesson.isFinished" class="text-h6 mr-1">{{ lesson.userScore }} / {{ lesson.lessonDTO.points }}</div>
    <div v-if="!lesson.isFinished" class="text-h6 mr-1">{{ lesson.lessonDTO.points }}</div>
    <v-icon class="mr-4" size="35" :icon="'mdi-star-four-points-circle-outline'"></v-icon>

    <v-badge
        v-if="!lesson.isFinished"
        inline
        :color="'error'"
        :content="'NEU'">
    </v-badge>

    <v-badge
        v-if="lesson.isFinished && !lesson.isStarted"
        inline
        :color="'success'"
        :content="'ABGESCHLOSSEN'">
    </v-badge>

    <v-badge
        v-if="lesson.isFinished && lesson.isStarted"
        inline
        :color="'success'"
        :content="'BEREITS ABGESCHLOSSEN'">
    </v-badge>

    <v-badge
        v-if="lesson.isFinished && lesson.isStarted"
        inline
        :color="'warning'"
        :content="'BEGONNEN'">
    </v-badge>

    <v-btn-group
        v-if="lesson.isFinished && !lesson.isStarted"
        class="ml-3"
        variant="outlined"
        elevation="24"
        divided
        density="default"
    >
      <v-btn color="warning" class="mr-2" @click.stop="alertService.addHelpDialog('resetLesson', resetLesson)">
        Nochmal bearbeiten
      </v-btn>
    </v-btn-group>
    <v-btn-group
        v-if="lesson.hasSavedProgress"
        class="ml-3"
        variant="outlined"
        elevation="24"
        divided
        density="default"
    >
      <v-btn color="warning" class="mr-2" @click.stop="openDialog">
        Neustarten
      </v-btn>
    </v-btn-group>
  </div>
</template>

<style scoped>

</style>