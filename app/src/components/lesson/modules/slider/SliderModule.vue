<script setup lang="ts">
import { ref, watch } from "vue";
import Hint from "@/components/lesson/builder/helper/Hint.vue";
import Help from "@/components/lesson/builder/helper/Help.vue";
import {useLessonStore} from "@/stores/lesson.ts";
import {useAuthStore} from "@/stores/auth.ts";

interface Props {
  componentId: string,
}

const props = defineProps<Props>();

const inputValue = ref<number>(0);

const lessonStore = useLessonStore();
const question = lessonStore.getLessonModuleFieldValues(props.componentId, 'question')
const hint = lessonStore.getLessonModuleFieldValues(props.componentId, 'hint')
const solution = lessonStore.getLessonModuleFieldValues(props.componentId, 'solution');
const questionId = lessonStore.getLessonModuleFieldValues(props.componentId, 'uuid');
const minValue = ref<number>();
const maxValue = ref<number>();
const correctValue = ref<number>();

const authStore = useAuthStore();
const isTeacher: boolean = authStore.isTeacher;
const points = lessonStore.getLessonModuleFieldValues(props.componentId, 'points');
const fields = ref<any>({
  options: lessonStore.getLessonModuleFieldValues(props.componentId, 'options'),
});

function updateStoreData(fields: any) {
  lessonStore.setLessonModuleData(props.componentId, 'options', fields.options);
}

init();

function init() {

  if (solution) {
    minValue.value = (+solution.correctValue - +solution.toleranceValue);
    maxValue.value = (+solution.correctValue + +solution.toleranceValue);
    correctValue.value = (+solution.correctValue);
  }

  if (fields.value.options.hasOwnProperty('input')) {
    inputValue.value = fields.value.options.input;
  } else {
    inputValue.value = (fields.value.options.maxValue / 2);
    fields.value.options = {
      steps: fields.value.options.steps,
      minValue: fields.value.options.minValue,
      maxValue: fields.value.options.maxValue,
      input: inputValue.value
    };
  }

  if (isTeacher && correctValue.value !== undefined) {
    inputValue.value = correctValue.value;
  }
  updateStoreData(fields.value)
}

function checkSolution() {
  if (solution && minValue.value && maxValue.value) {
    return (inputValue.value >= minValue.value && inputValue.value <= maxValue.value)
  }
}

watch(inputValue, (newInput) => {
  fields.value.options = {
    type: "Slider",
    steps: fields.value.options.steps,
    minValue: fields.value.options.minValue,
    maxValue: fields.value.options.maxValue,
    input: newInput
  };
  updateStoreData(fields.value)
}, {deep: true});
</script>

<template>
  <v-card variant="flat">
    <v-container>
      <v-row>
        <v-col cols="auto">
          <div class="text-h6 text-md-h5">Slider</div>
        </v-col>
        <v-col cols="auto" class="d-flex flex-grow-1 justify-end mr-2" align-self="center">
          <div class="text-h4">
            {{ points }}
            <v-icon class="mb-1" size="35" color="warning" :icon="'mdi-star-four-points-circle-outline'"></v-icon>
          </div>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="10">
          <v-row>
            <v-col>
              <div class="text-h6">{{ question }}</div>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
      <v-row>
        <v-col v-if="solution" class="text-center">
          <div class="text-h6 mb-2">Ihre Antwort: {{ inputValue }}</div>
          <div class="text-h6 mb-2">Richtige Antwort: {{ correctValue }}</div>
          <div v-if="minValue != maxValue" class="text-h6 mb-2">Toleranzbereich zwischen: {{ minValue }} und {{
              maxValue
            }}
          </div>
        </v-col>
        <v-col>
          <v-slider
              v-model="inputValue"
              :readonly="!!solution"
              :min="fields.options.minValue"
              :max="fields.options.maxValue"
              :step="fields.options.steps"
              :color="solution && checkSolution() ? 'success' : 'orange'"
              track-color="warning"
              thumb-label>
          </v-slider>
        </v-col>
      </v-row>
      <v-row>
        <v-col class="d-flex flex-grow-1 align-end justify-end">
          <div class="mr-2">
            <Help dialog-type="sliderExplanation"></Help>
          </div>
          <div>
            <Hint v-if="hint" :hint="hint" :questionId="questionId"></Hint>
          </div>
        </v-col>
      </v-row>
    </v-container>
  </v-card>
</template>
