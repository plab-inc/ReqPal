<template>
  <v-card>
    <v-container>
      <h2>True Or False?</h2>

      <p>{{ props.question.description }}</p>
      <p v-if="submitted">Solution:</p>
      <v-form v-model="isFormValid" @submit.prevent="submitAnswers" fast-fail>

        <v-radio-group v-model="selectedAnswer" :rules="[rules.requiredBool]">
          <v-radio label="True" v-bind:value="true"
                   :class="{'disabled': submitted,'right': result === true, 'wrong': result === false}"></v-radio>
          <v-radio label="False" v-bind:value="false"
                   :class="{'disabled': submitted, 'right': result === false, 'wrong': result === true}"></v-radio>
        </v-radio-group>

        <v-btn type="submit" class="mt-4" :disabled="submitted">Submit</v-btn>
      </v-form>
    </v-container>
  </v-card>
</template>

<script setup lang="ts">

import {ref} from "vue";
import {useLessonStore} from "@/stores/lesson.store";
import {Question} from "@/types/lesson.types";
import {booleanValueRule} from "@/utils/validationRules.ts";

interface Props {
  question: Question;
}

const props = defineProps<Props>();
const selectedAnswer = ref<boolean>();
const submitted = ref(false);
const lessonStore = useLessonStore();
let result: boolean | null;

const isFormValid = ref(false);
const rules = {
  requiredBool: booleanValueRule
};

async function submitAnswers(): Promise<void> {
  if (isFormValid.value) {
    result = await lessonStore.fetchTrueFalseSolutionForQuestion(props.question.id);
    submitted.value = true;
  }
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