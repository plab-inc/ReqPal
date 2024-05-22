<script setup lang="ts">
import {useLessonStore} from "@/stores/lesson.ts";
import alertService from "@/services/util/alert.ts";
import AlertService from "@/services/util/alert.ts";
import router from "@/router";
import LessonQuestions from "@/components/lesson/generator/LessonQuestions.vue";
import {LessonDTO} from "@/types/lesson.ts";
import { ref } from "vue";

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
  <v-row justify="space-between" align="center">
    <v-col cols="auto" class="text-h4">
      {{ currentLesson?.title }}
    </v-col>
    <v-col cols="auto" class="text-h4" align-self="center">
      {{ currentLesson?.points }}
      <v-icon class="mb-1" size="35" color="warning" :icon="'mdi-star-four-points-circle-outline'"></v-icon>
    </v-col>
  </v-row>
  <v-row align="center" no-gutters>
    <v-col cols="11" class="text-h5">
      {{ sortedQuestions.length <= 0 ? 'Noch keine Fragen!' : currentLesson?.description }}
    </v-col>
  </v-row>
  <v-divider/>
    <v-form @submit.prevent ref="form">
      <v-row no-gutters>
        <v-col>
          <LessonQuestions :components="lessonStore.getLessonModules"></LessonQuestions>
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
</template>
