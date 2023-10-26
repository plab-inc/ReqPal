<script setup lang="ts">
import {ref} from "vue";
import Hint from "@/components/lesson/modules/Hint.component.vue";
import Help from "@/components/lesson/modules/Help.component.vue";
import {useLessonStore} from "@/stores/lesson.store.ts";

interface Props {
  componentId: string,
}

const props = defineProps<Props>();

const inputValue = ref<number>(0);

const lessonStore = useLessonStore();
const question = lessonStore.getComponentFieldValues(props.componentId, 'question')
const hint = lessonStore.getComponentFieldValues(props.componentId, 'hint')
const solution = lessonStore.getComponentFieldValues(props.componentId, 'solution');
const minValue = ref<number>();
const maxValue = ref<number>();
const correctValue = ref<number>();

const fields = ref<any>({
  options: lessonStore.getComponentFieldValues(props.componentId, 'options'),
});

function updateStoreData(fields: any) {
  lessonStore.setComponentData(props.componentId, 'options', fields.options);
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
    updateStoreData(fields.value)
  }
}

function checkSolution() {
  if (solution && minValue.value && maxValue.value) {
    return (inputValue.value >= minValue.value && inputValue.value <= maxValue.value)
  }
}

watch(inputValue, (newInput) => {
  fields.value.options = {
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
        <v-col cols="10">
          <v-row>
            <div class="text-h6 text-md-h5 mr-2">Slider</div>
          </v-row>
          <v-row>
            <v-col>
              <div class="text-h6">{{ question }}</div>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
      <v-row>
        <v-col v-if="solution" class="text-center">
          <div class="text-h6 mb-2">Richtige Antwort: {{ correctValue }}</div>
          <div class="text-h6 mb-2">Toleranzbereich zwischen: {{ minValue }} und {{ maxValue }}</div>
        </v-col>
        <v-col>
          <v-slider
              v-model="inputValue"
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
            <Help dialog-type="mcExplanation"></Help>
          </div>
          <div>
            <Hint v-if="hint" :hint="hint"></Hint>
          </div>
        </v-col>
      </v-row>
    </v-container>
  </v-card>
</template>
