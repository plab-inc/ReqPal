<script setup lang="ts">

import {useLessonStore} from "@/stores/lesson.store";
import {requiredRule} from "@/utils/validationRules";

const lessonStore = useLessonStore();
const lesson = lessonStore.getLessonById;
const solution = ref<boolean>();
const question = ref("");
const isFormValid = ref(false);
const rules = {
  required: requiredRule,
};

async function submitQuestion(): Promise<void> {
  console.log("Submitted:")
  console.log("Question: " + question.value)
  console.log("Solution: " + solution.value)
}
</script>

<template>
  <h1>Aufgabenerstellung True False</h1>
  <h2>{{ lesson?.title }}</h2>

  <v-form v-model="isFormValid" @submit.prevent="submitQuestion" ref="signUpForm" fast-fail>
    <v-text-field
        v-model="question"
        label="Question"
        :rules="[rules.required]"
    ></v-text-field>

    <v-radio-group v-model="solution" :rules="[rules.required]" label="Solution of the question:">
      <v-radio label="True" value="true"></v-radio>
      <v-radio label="False" value="false"></v-radio>
    </v-radio-group>

    <v-btn block type="submit" :disabled="!isFormValid" @click="submitQuestion">Add question</v-btn>
  </v-form>

  <h4>{{ question }}</h4>
  <h4>{{ solution }}</h4>
</template>

<style scoped>

</style>