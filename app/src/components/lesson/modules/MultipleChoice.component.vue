<script setup lang="ts">

import {ref} from "vue";
import Hint from "@/components/lesson/modules/Hint.component.vue"
import {useLessonFormStore} from "@/stores/lessonForm.store.ts";
import Help from "@/components/lesson/modules/Help.component.vue"

type Solution = { id: number, solution: boolean }

interface Props {
  componentId: string,
}

const props = defineProps<Props>();
const solution = ref<Solution[]>();
const selectedAnswers = ref<any>([]);
const mcExplanation =
    "In einer Multiple-Choice-Aufgabe ist das Ziel, alle Aussagen auszuwählen, die auf die zuvor gestellte Frage zutreffen. " +
    "Sie haben die Möglichkeit, mehrere oder auch keine Aussagen auszuwählen. " +
    "Bitte lesen Sie die Frage sorgfältig durch und überlegen Sie, welche Aussagen wahr und welche falsch sind. " +
    "Sobald Sie eine Aussage auswählen, gilt sie als zutreffend."

function checkSolution(id: number) {
  if (solution.value) {
    const found = solution.value.find(s => s.id === id);
    if (found) {
      return found.solution;
    } else return undefined;
  }
}

const lessonFormStore = useLessonFormStore();
const question = lessonFormStore.getComponentFieldValues(props.componentId, 'question')
const hint = lessonFormStore.getComponentFieldValues(props.componentId, 'hint')

const fields = ref<any>({
  options: lessonFormStore.getComponentFieldValues(props.componentId, 'options'),
});

init();

function init() {
  fields.value.options.forEach((option: any) => {
    selectedAnswers.value[option.id] = option.input !== undefined ? option.input : false;
  })
}

function updateStoreData(fields: any) {
  lessonFormStore.setComponentData(props.componentId, 'options', fields);
}

watch(selectedAnswers, (newAnswers) => {
  const objects = fields.value.options.map((option: any) => ({
    id: option.id,
    description: option.description,
    input: newAnswers[option.id] !== undefined ? newAnswers[option.id] : false
  }));
  fields.value.options = objects;
  updateStoreData(objects)
}, {deep: true});

</script>

<template>
  <v-card variant="flat">
    <v-container>
      <v-row>
        <v-col cols="10">
          <v-row>
            <v-col class="d-flex justify-start align-center">
              <div class="text-h6 text-md-h5 mr-2">Multiple Choice</div>
              <Help title="Multiple Choice Aufgabe: Erklärung" :text="mcExplanation"></Help>
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <v-container>
                <div class="text-h6">{{ question }}</div>
                <div class="text-h6" v-if="solution">Lösung:</div>

                <v-checkbox v-for="(answer) in fields.options"
                            :key="answer.id"
                            :label="answer.description"
                            v-model="selectedAnswers[answer.id]"
                            :class="{ 'right': (solution && checkSolution(answer.id)),
                'disabled': solution,
                'wrong': (solution && !checkSolution(answer.id))}">
                </v-checkbox>
              </v-container>
            </v-col>
          </v-row>
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
