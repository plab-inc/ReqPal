<script setup lang="ts">

import {ref} from "vue";
import Hint from "@/components/lesson/modules/Hint.component.vue"
import Help from "@/components/lesson/modules/Help.component.vue"
import {useLessonStore} from "@/stores/lesson.store.ts";

interface Props {
  componentId: string,
}

const props = defineProps<Props>();
const selectedAnswers = ref<any>([]);

const lessonStore = useLessonStore();
const question = lessonStore.getComponentFieldValues(props.componentId, 'question')
const hint = lessonStore.getComponentFieldValues(props.componentId, 'hint')
const solution = lessonStore.getComponentFieldValues(props.componentId, 'solution')

const fields = ref<any>({
  options: lessonStore.getComponentFieldValues(props.componentId, 'options'),
});

function checkSolution(id: number) {
  if (solution) {
    const found = solution.find((s: any) => s.id === id);
    if (found) {
      const option = fields.value.options.find((o: any) => o.id === id);
      if (option) {
        return (option.input === found.solution);
      }
    } else return undefined;
  }
}

init();

function init() {
  fields.value.options.forEach((option: any) => {
    selectedAnswers.value[option.id] = option.input !== undefined ? option.input : false;
  })
}

function updateStoreData(fields: any) {
  lessonStore.setComponentData(props.componentId, 'options', fields);
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
              <Help dialog-type="mcExplanation"></Help>
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <v-container>
                <div class="text-h6">{{ question }}</div>

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
