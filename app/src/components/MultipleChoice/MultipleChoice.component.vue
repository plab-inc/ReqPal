<template>
  <v-card>
    <v-container>
      <div class="text-h6 text-md-h5">Multiple Choice</div>

      <v-form v-if="answers" @submit.prevent="submitAnswers" fast-fail>

        <div class="text-h6">{{ props.question.description }}</div>
        <div class="text-h6" v-if="submitted">Solution:</div>

        <v-checkbox v-for="(answer, index) in answers"
                    :key="index"
                    :label="answer.description"
                    v-model="selectedAnswers[index]"
                    :class="{ 'right': submitted && (props.question.userResults?.wholeAnswerIsCorrect || (props.question.userResults?.results[index]?.answerIsCorrect ?? false)),
                'disabled': submitted,
                'wrong': submitted && !(props.question.userResults?.results[index]?.answerIsCorrect ?? false)}">
        </v-checkbox>

        <v-btn type="submit" :disabled="submitted">Submit</v-btn>
      </v-form>
    </v-container>
  </v-card>
</template>

<script setup lang="ts">

import {ref} from "vue";
import {useLessonStore} from "@/stores/lesson.store";
import {Answer, Question} from "@/types/lesson.types";

interface Props {
  question: Question;
}

const props = defineProps<Props>();
const selectedAnswers = ref<boolean[]>([]);
const submitted = ref(false);
const lessonStore = useLessonStore();
const answers = ref<Answer[]>();

async function submitAnswers(): Promise<void> {
  if (submitted.value) return;
  if (answers.value) {
    const userAnswers = answers.value.map((answer, index) => {
      return {
        id: answer.id,
        description: answer.description,
        solution: selectedAnswers.value[index],
      };
    });

    await lessonStore.compareUserMCAnswers(userAnswers, props.question.id);
    submitted.value = true;
  }
}

onBeforeMount(async () => {
  answers.value = await lessonStore.fetchMCAnswersForQuestion(props.question.id);
  if (answers.value) selectedAnswers.value = answers.value.map(() => false);
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