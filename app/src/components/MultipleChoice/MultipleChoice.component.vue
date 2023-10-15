<script setup lang="ts">

import {ref} from "vue";

type Option = { id: number, description: string }
type Solution = { id: number, solution: boolean }

interface Props {
  componentId: number,
  question: string,
  options: Option[] | any,
  solution: Solution[] | any | undefined
}

const props = defineProps<Props>();

const selectedAnswers = ref<Option[]>([]);

function checkSolution(id: number) {
  if (typeof props.solution === 'object' && Array.isArray(props.solution)) {
    const found = props.solution.find(s => s.id === id);
    if (found) {
      return found.solution;
    } else return undefined;
  }
}
</script>

<template>
  <v-card>
    <v-container>
      <div class="text-h6 text-md-h5">Multiple Choice</div>
      <v-form fast-fail>
        <div class="text-h6">{{ question }}</div>
        <div class="text-h6" v-if="solution">Lösung:</div>

        <v-checkbox v-for="(answer, index) in options"
                    :key="answer.id"
                    :label="answer.description"
                    v-model="selectedAnswers[index]"
                    :class="{ 'right': (solution && checkSolution(answer.id)),
                'disabled': solution,
                'wrong': (solution && !checkSolution(answer.id))}">
        </v-checkbox>
      </v-form>
    </v-container>
  </v-card>
</template>

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