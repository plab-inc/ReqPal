<template>
  <v-card>
    <v-container>
      <h2>Multiple Choice Test</h2>

      <p>{{ props.question }}</p>
      <p v-if="submitted">Lösung:</p>

      <v-checkbox v-for="(answer, index) in props.answers"
                  :key="index"
                  :label="answer.text"
                  v-model="selectedAnswers[index]"
                  :class="{ 'right': submitted && selectedAnswers[index] == answer.right,
                'disabled': submitted,
                'wrong': submitted && selectedAnswers[index] != answer.right}">
      </v-checkbox>

      <v-btn @click="submitAnswers">Submit</v-btn>
    </v-container>
  </v-card>
</template>

<script setup lang="ts">

import {onMounted, ref} from "vue";

interface Answer {
  text: string,
  right: boolean,
  id: number
}

interface Props {
  question: string;
  answers: Answer[];
}

const props = defineProps<Props>();
const selectedAnswers = ref<boolean[]>([]);
const submitted = ref(false);

function submitAnswers(): void {
  submitted.value = true;
}

onMounted(() => {
  selectedAnswers.value = props.answers.map(() => false);
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