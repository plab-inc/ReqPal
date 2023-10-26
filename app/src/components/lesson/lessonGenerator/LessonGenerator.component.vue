<script setup lang="ts">
import {useLessonStore} from "@/stores/lesson.store.ts";
import alertService from "@/services/util/alert.service.ts";
import router from "@/router";
import AlertService from "@/services/util/alert.service.ts";
import LessonQuestions from "@/components/lesson/lessonGenerator/LessonQuestions.component.vue";

const lessonStore = useLessonStore();
const sortedQuestions = lessonStore.getSortedCurrentQuestions;
const currentLesson = lessonStore.getCurrentLesson;

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
        const id = currentLesson.uuid;
        await router.push({name: 'LessonResults', params: {lessonUUID: id}});
      } catch (error: any) {
        AlertService.addErrorAlert("Fehler beim Abschicken der Daten: " + error.message);
      }
    }
  }
}

init();

function init() {
  if (lessonStore.components.length <= 0) {
    sortedQuestions.forEach(q => {
      lessonStore.addComponentWithData(q.question_type, q.uuid, {
        uuid: q.uuid,
        question: q.question,
        options: q.options,
        solution: q.solution,
        hint: q.hint
      })
    })
  }
}

async function resetLesson() {
  if (lessonStore.currentLesson) {
    try {
      await lessonStore.resetUserAnswersForLesson(lessonStore.currentLesson.uuid);
      await router.push({name: 'Lessons'});
    } catch (error: any) {
      AlertService.addErrorAlert("Fehler beim Zurücksetzen: " + error.message);
    }
  }

}

async function openLessonResults() {
  if (lessonStore.currentLesson && lessonStore.lessonFinished) {
    try {
      const id = lessonStore.currentLesson.uuid;
      await router.push({name: 'LessonResults', params: {lessonUUID: id}});
    } catch (error: any) {
      AlertService.addErrorAlert("Fehler beim Öffnen der Ergebnisse: " + error.message);
    }
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
    <v-row v-if="lessonStore.lessonFinished">
      <v-col class="d-flex justify-end my-2">
        <v-btn color="warning" class="mr-2" @click="alertService.addHelpDialog('resetLesson', resetLesson)">Nochmal
          bearbeiten
        </v-btn>
        <v-btn color="success" @click="openLessonResults">Zu den Ergebnissen</v-btn>
      </v-col>
    </v-row>

    <v-divider></v-divider>
    <v-form @submit.prevent ref="form">
      <v-row class="mt-4">
        <v-col>
          <LessonQuestions></LessonQuestions>
        </v-col>
      </v-row>
      <v-row v-if="!lessonStore.lessonFinished">
        <v-col>
          <v-container>
            <v-btn :disabled="lessonStore.lessonFinished" type="submit"
                   @click="alertService.addHelpDialog('lessonFinished', submit)">Submit
            </v-btn>
          </v-container>
        </v-col>
      </v-row>
    </v-form>
  </v-container>
</template>

<style scoped>

</style>
