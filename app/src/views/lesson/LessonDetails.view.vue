<script setup lang="ts">
import {useLessonStore} from "@/stores/lesson.store.ts";
import alertService from "@/services/util/alert.service.ts";
import router from "@/router";
import AlertService from "@/services/util/alert.service.ts";
import LessonQuestions from "@/components/lesson/lessonGenerator/LessonQuestions.component.vue";
import {LessonDTO} from "@/types/lesson.types.ts";

const lessonStore = useLessonStore();
const sortedQuestions = lessonStore.getSortedCurrentQuestions;
const currentLesson: LessonDTO | undefined = lessonStore.getCurrentLesson?.lessonDTO;
const isFinished = lessonStore.getCurrentLesson?.isFinished;
const isStarted = lessonStore.getCurrentLesson?.isStarted;

const form = ref<any>(null);

async function checkValidity() {
  return (await form.value.validate()).valid;
}

defineExpose({
  checkValidity
});

async function submit() {
  const formIsValid = await checkValidity();

  if (formIsValid && currentLesson) {
    let lessonJson = lessonStore.generateUserResults();

    if (lessonJson) {
      try {
        await lessonStore.submitUserAnswers(lessonJson);
        await router.push({name: 'LessonResults', params: {lessonUUID: currentLesson.uuid}});
      } catch (error: any) {
        AlertService.addErrorAlert("Fehler beim Abschicken der Daten: " + error.message);
      }
    }
  }
}

async function saveProgress() {
  try {
    let lessonJson = lessonStore.generateUserResults();
    if (lessonJson) await lessonStore.uploadUserProgressToLesson(lessonJson);
    AlertService.addSuccessAlert('Fortschritt erfolgreich gespeichert!')
  } catch (error: any) {
    AlertService.addErrorAlert('Fortschritt konnte nicht gespeichert werden.')
  }
}

async function openDialog() {
  const formIsValid = await checkValidity();
  if (formIsValid) {
    alertService.addHelpDialog('lessonFinished', submit)
  } else {
    alertService.addInfoAlert("Die Lektion wurde noch nicht vollständig bearbeitet.")
  }
}
</script>

<template>
  <v-container v-if="sortedQuestions.length <= 0">
    <div class="text-subtitle-1">Noch keine Fragen!</div>
  </v-container>

  <v-container v-else>
    <v-row class="mb-4">
      <v-col sm="10">
        <div class="text-h3 text-sm-start text-center">{{ currentLesson?.title }}</div>
        <div class="text-h5 mt-4 text-sm-start text-center">{{ currentLesson?.description }}</div>
      </v-col>
      <v-col sm="2">
        <div class="d-flex align-center justify-center justify-sm-end">
          <div class="text-h4 mr-2">{{ currentLesson?.points }}</div>
          <v-icon size="35" :icon="'mdi-star-four-points-circle-outline'"></v-icon>
        </div>
      </v-col>
    </v-row>

    <v-divider></v-divider>
    <v-form @submit.prevent ref="form">
      <v-row class="mt-4">
        <v-col>
          <LessonQuestions :components="lessonStore.getComponents"></LessonQuestions>
        </v-col>
      </v-row>
      <v-row v-if="!isFinished || isStarted">
        <v-col>
          <v-container>
            <v-btn :disabled="!isStarted && isFinished" type="button" class="mr-2"
                   @click="saveProgress">Speichern
            </v-btn>
            <v-btn :disabled="!isStarted && isFinished" type="submit"
                   @click="openDialog">Antworten abschicken
            </v-btn>
          </v-container>
        </v-col>
      </v-row>
    </v-form>
  </v-container>
</template>
