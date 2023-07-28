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
                  :class="{ 'right': submitted && (props.question.userResults?.wholeAnswerIsCorrect || (props.question.userResults?.results[index]?.answerIsCorrect ?? false)),
                'disabled': submitted,
                'wrong': submitted && !(props.question.userResults?.results[index]?.answerIsCorrect ?? false)}">
      </v-checkbox>

      <v-btn @click="submitAnswers">Submit</v-btn>

    </v-container>
  </v-card>
</template>

<script setup lang="ts">

import {onMounted, ref} from "vue";
import {Question, useLessonStore} from "@/stores/lesson.store";

interface Props {
  question: Question;
}

const props = defineProps<Props>();
const selectedAnswers = ref<boolean[]>([]);
const submitted = ref(false);
const lessonStore = useLessonStore();

async function submitAnswers(): Promise<void> {
  if (submitted.value) return;

  const userAnswers = props.question.answers.map((answer, index) => {
    return {
      id: answer.id,
      description: answer.description,
      solution: selectedAnswers.value[index],
    };
  });

  await lessonStore.compareUserAnswers(userAnswers, props.question.id);
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