<script setup lang="ts">

import {useLessonStore} from "@/stores/lesson.store";
import {booleanValueRule, requiredRule} from "@/utils/validationRules";
import AlertService from "@/services/alert.service";
import router from "@/router";

const lessonStore = useLessonStore();
const lesson = lessonStore.getLessonById;
const solution = ref<boolean>(true);
const question = ref("");
const isFormValid = ref(false);
const rules = {
  required: requiredRule,
  requiredBool: booleanValueRule,
};

async function submitQuestion(): Promise<void> {
  try {
    if (lesson) {
      await lessonStore.addTrueOrFalseQuestion(lesson.id, question.value, solution.value);
      AlertService.addSuccessAlert("Frage wurde zur Lektion hinzugefügt " + lesson.id + ": " + lesson.title);
      await router.push({name: "Lessons"})
    } else {
      AlertService.addErrorAlert("Lektion nicht gefunden.");
    }
  } catch (error: any) {
    AlertService.addErrorAlert("Ein Fehler ist aufgetreten: " + error.message);
  }
}
</script>

<template>
  <h1>Aufgabenerstellung True False</h1>

  <v-form v-model="isFormValid" @submit.prevent="submitQuestion" fast-fail>
    <v-text-field
        v-model="question"
        label="Question"
        :rules="[rules.required]"
    ></v-text-field>

    <v-radio-group v-model="solution" :rules="[rules.requiredBool]" label="Solution of the question:">
      <v-radio label="True" v-bind:value="true"></v-radio>
      <v-radio label="False" v-bind:value="false"></v-radio>
    </v-radio-group>

    <v-btn class="mt-8" block type="submit" :disabled="!isFormValid">Add question</v-btn>
  </v-form>
</template>

<style scoped>

</style>