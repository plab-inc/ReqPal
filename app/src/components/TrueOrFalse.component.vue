<template>
  <v-card>
    <v-container>
      <h2>True Or False?</h2>

      <p>{{ props.question.description }}</p>
      <p v-if="submitted">Solution:</p>

      <v-radio-group v-model="selectedAnswer">
        <v-radio label="True" value="true"
                 :class="{'disabled': submitted,'right': result === true, 'wrong': result === false}"></v-radio>
        <v-radio label="False" value="false"
                 :class="{'disabled': submitted, 'right': result === false, 'wrong': result === true}"></v-radio>
        <p v-if="triedToSubmit">Please choose an answer before submitting!</p>
      </v-radio-group>

      <v-btn @click="submitAnswers">Submit</v-btn>

    </v-container>
  </v-card>
</template>

<script setup lang="ts">

import {ref} from "vue";
import {useLessonStore} from "@/stores/lesson.store";
import {Question} from "@/types/lesson.types";

interface Props {
  question: Question;
}

const props = defineProps<Props>();
const selectedAnswer = ref<boolean>();
const submitted = ref(false);
const triedToSubmit = ref(false);
const lessonStore = useLessonStore();
let result: boolean | null;

async function submitAnswers(): Promise<void> {
  if (!selectedAnswer.value) {
    triedToSubmit.value = true;
    return;
  }

  result = await lessonStore.fetchTrueFalseAnswersForQuestion(props.question.id);
  submitted.value = true;
  triedToSubmit.value = false;
}

</script>

<style scoped>
.right {
  color: #52ff52;
  font-weight: bold;
}

.wrong {
  color: #ff4b4b;
  font-weight: bold;
}

.disabled {
  cursor: not-allowed;
  pointer-events: none;
}
</style>