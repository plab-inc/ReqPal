<template>
  <v-card>
    <v-container>
      <h2>Multiple Choice Test</h2>

      <p>{{ props.question.description }}</p>
      <p v-if="submitted">Lösung:</p>

      <v-checkbox v-for="(answer, index) in props.question.answers"
                  :key="index"
                  :label="answer.description"
                  v-model="selectedAnswers[index]"
                  :class="{ 'right': submitted && selectedAnswers[index] == answer.isCorrect,
                'disabled': submitted,
                'wrong': submitted && selectedAnswers[index] != answer.isCorrect}">
      </v-checkbox>

      <v-btn @click="submitAnswers">Submit</v-btn>
    </v-container>
  </v-card>
</template>

<script setup lang="ts">

import {onMounted, ref} from "vue";
import {Question} from "@/stores/lesson.store";

interface Props {
  question: Question;
}

const props = defineProps<Props>();
const selectedAnswers = ref<boolean[]>([]);
const submitted = ref(false);

function submitAnswers(): void {
  submitted.value = true;
}

onMounted(() => {
  selectedAnswers.value = props.question.answers.map(() => false);
});

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