<script setup lang="ts">

import {ref} from "vue";
import Hint from "@/components/lesson/modules/Hint.component.vue"

type Option = { id: number, description: string }
type Solution = { id: number, solution: boolean }

interface Props {
  componentId: number,
  question: string | any,
  options: Option[] | any,
  hint: string | any,
}

const props = defineProps<Props>();
const solution = ref<Solution[]>();
const selectedAnswers = ref<Option[]>([]);

function checkSolution(id: number) {
  if(solution.value) {
    const found = solution.value.find(s => s.id === id);
    if (found) {
      return found.solution;
    } else return undefined;
  }
}
</script>

<template>
  <v-card variant="flat">
    <v-container>
      <v-row>
        <v-col cols="10">
          <div class="text-h6 text-md-h5">Multiple Choice</div>
          <v-container>
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
        </v-col>
        <v-col cols="2">
          <Hint v-if="hint" :hint="hint"></Hint>
        </v-col>
      </v-row>
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