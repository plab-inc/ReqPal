<script setup lang="ts">

import {ref} from "vue";
import {useLessonStore} from "@/stores/lesson.store";
import {booleanValueRule, requiredRule} from "@/utils/validationRules";
import AlertService from "@/services/alert.service";

import router from "@/router";
import {mcAnswer} from "@/types/lesson.types";

const lessonStore = useLessonStore();
const lesson = lessonStore.getLessonById;
const question = ref("");
const minAnswers = 3;
const maxAnswers = 10;

const isFormValid = ref(false);
const rules = {
  required: requiredRule,
  requiredBool: booleanValueRule,
};

const answers = ref<mcAnswer[]>([]);
for (let i = 0; i < minAnswers; i++) {
  addAnswer();
}

function addAnswer() {
  answers.value.push({id: -1, description: "", solution: false});
}

function removeAnswer(index: number) {
  answers.value.splice(index, 1);
}

async function submitQuestion(): Promise<void> {
  try {
    if (lesson) {
      answers.value.forEach((a, index) => a.id = index)
      await lessonStore.addMultipleChoiceQuestion(lesson.id, question.value, answers.value);
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
  <h1>Aufgabenerstellung Multiple Choice</h1>

  <v-form v-model="isFormValid" @submit.prevent="submitQuestion" fast-fail>
    <h3>Question</h3>
    <v-text-field
        v-model="question"
        label="Question"
        :rules="[rules.required]"
    ></v-text-field>

    <h3>Answers</h3>
    <div v-for="(answer, index) in answers" :key="index">
      <v-row>
        <v-col md="7">
          <v-text-field
              v-model="answer.description"
              :label="'Answer ' + (index + 1)"
              :rules="[rules.required]"
          ></v-text-field>
        </v-col>
        <v-col md="3" sm="8">
          <v-radio-group v-model="answer.solution" :rules="[rules.requiredBool]" label="Solution of the answer:">
            <v-radio label="True" v-bind:value="true"></v-radio>
            <v-radio label="False" v-bind:value="false"></v-radio>
          </v-radio-group>
        </v-col>
        <v-col md="2" sm="4">
          <v-btn v-if="index >= minAnswers" @click="removeAnswer(index)">
            <v-icon>
              mdi-delete
            </v-icon>
            Remove
          </v-btn>
        </v-col>
      </v-row>
    </div>
    <v-btn v-if="answers.length < maxAnswers" @click="addAnswer" class="mt-4">
      <v-icon>
        mdi-plus
      </v-icon>
      Answer
    </v-btn>
    <v-btn class="mt-8" block type="submit" :disabled="!isFormValid">Add question</v-btn>
  </v-form>
</template>

<style scoped>
</style>