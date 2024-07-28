<script setup lang="ts">

import Help from "@/components/lesson/builder/helper/Help.vue";
import Hint from "@/components/lesson/builder/helper/Hint.vue";
import {useAuthStore} from "@/stores/auth.ts";
import {useLessonStore} from "@/stores/lesson.ts";
import {ref, watch} from "vue";

interface Props {
  componentId: string,
}

const props = defineProps<Props>();
const selectedAnswers = ref<any>([]);

const lessonStore = useLessonStore();
const question = lessonStore.getLessonModuleFieldValues(props.componentId, 'question')
const hint = lessonStore.getLessonModuleFieldValues(props.componentId, 'hint')
const solution = lessonStore.getLessonModuleFieldValues(props.componentId, 'solution')
const questionId = lessonStore.getLessonModuleFieldValues(props.componentId, 'uuid');
const points = lessonStore.getLessonModuleFieldValues(props.componentId, 'points');
const authStore = useAuthStore();
const isTeacher: boolean = authStore.isTeacher;

const fields = ref<any>({
  options: lessonStore.getLessonModuleFieldValues(props.componentId, 'options') || {
    type: "MultipleChoice",
    answers: []
  },
});

function checkSolution(id: number) {
  if (solution && solution.answers) {
    const found = solution.answers.find((s: any) => s.id === id);
    if (isTeacher && found) {
      return found.solution;
    }
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
  if (fields.value.options && fields.value.options.answers) {

    if (isTeacher) {
      fields.value.options.answers.forEach((option: any) => {
        selectedAnswers.value[option.id] = checkSolution(option.id);
      })
    } else {
      fields.value.options.answers.forEach((option: any) => {
        if (option.input === undefined) {
          fields.value.options.answers = fields.value.options.answers.map((option: any) => ({
            id: option.id,
            description: option.description,
            input: false,
          }));
          updateStoreData(fields.value.options)
        }
        selectedAnswers.value[option.id] = option.input !== undefined ? option.input : false;
      })
    }
  }
}

function updateStoreData(fields: any) {
  lessonStore.setLessonModuleData(props.componentId, 'options', fields);
}

watch(selectedAnswers, (newAnswers) => {
  fields.value.options.answers = fields.value.options.answers.map((option: any) => ({
    id: option.id,
    description: option.description,
    input: newAnswers[option.id] !== undefined ? newAnswers[option.id] : false
  }));
  updateStoreData(fields.value.options)
}, {deep: true});

</script>

<template>
  <v-card variant="flat">
    <v-container>
      <v-row>
        <v-col cols="auto">
          <div class="text-h6 text-md-h5">Multiple Choice</div>
        </v-col>
        <v-col cols="auto" class="d-flex flex-grow-1 justify-end mr-2" align-self="center">
          <div class="text-h4">
            {{ points }}
            <v-icon class="mb-1" size="35" color="warning" :icon="'mdi-star-four-points-circle-outline'"></v-icon>
          </div>
        </v-col>
      </v-row>
      <v-row>
        <v-col sm="10">
          <v-row v-if="!isTeacher">
            <v-col>
              <v-container>
                <div class="text-h6">{{ question }}</div>

                <v-checkbox v-for="(answer) in fields.options.answers"
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

          <v-row v-else>
            <v-col>
              <v-container>
                <div class="text-h6">{{ question }}</div>

                <v-checkbox v-for="(answer) in fields.options.answers"
                            :key="answer.id"
                            :label="answer.description"
                            v-model="selectedAnswers[answer.id]"
                            :class="{ 'right': (solution && checkSolution(answer.id) && isTeacher),
                'disabled': solution,
                'wrong': (solution && !checkSolution(answer.id) && isTeacher)}">
                </v-checkbox>
              </v-container>
            </v-col>
          </v-row>

        </v-col>
        <v-col sm="2" class="d-flex flex-grow-1 align-end justify-end">
          <div class="mr-2">
            <Help dialog-type="mcExplanation"></Help>
          </div>
          <div>
            <Hint v-if="hint" :hint="hint" :questionId="questionId"></Hint>
          </div>
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
