<script setup lang="ts">

import { ref, watch } from "vue";
import {useLessonFormStore} from "@/stores/lessonForm.ts";
import {requiredNumberRule, requiredStringRule} from "@/utils/validationRules.ts";
import Help from "@/components/lesson/builder/helper/Help.vue";
import Delete from "@/components/lesson/builder/helper/Delete.vue";

const previewValue = ref<number>(5);
const props = defineProps<{ componentId: string }>();
const lessonFormStore = useLessonFormStore();

function betweenRange(x: number) {
  const min: number = (+sliderSolution.value.correctValue) - (+sliderSolution.value.toleranceValue);
  const max: number = (+sliderSolution.value.correctValue) + (+sliderSolution.value.toleranceValue);
  return x >= min && x <= max;
}

const storedOptions = lessonFormStore.getLessonModuleFieldValues(props.componentId, 'options');

const storedSolution = lessonFormStore.getLessonModuleFieldValues(props.componentId, 'solution');

const sliderOptions = ref<any>();
const sliderSolution = ref<any>();

init();

function init() {
  if (!storedOptions) {
    sliderOptions.value = {
      minValue: 0,
      maxValue: 10,
      steps: 1
    };
    lessonFormStore.setLessonModuleData(props.componentId, 'options', sliderOptions.value);
  } else {
    sliderOptions.value = storedOptions;
  }

  if (!storedSolution) {
    sliderSolution.value = {
      correctValue: 5,
      toleranceValue: 0
    };
    lessonFormStore.setLessonModuleData(props.componentId, 'solution', sliderSolution.value);
  } else {
    sliderSolution.value = storedSolution;
  }
}

const fields = ref<any>({
  question: lessonFormStore.getLessonModuleFieldValues(props.componentId, 'question'),
  hint: lessonFormStore.getLessonModuleFieldValues(props.componentId, 'hint')
});

watch(fields, (newFields) => {
  lessonFormStore.setLessonModuleData(props.componentId, 'question', newFields.question);
  lessonFormStore.setLessonModuleData(props.componentId, 'hint', newFields.hint);
}, {deep: true});

watch([sliderOptions, sliderSolution], () => {
  lessonFormStore.setLessonModuleData(props.componentId, 'options', sliderOptions.value);
  lessonFormStore.setLessonModuleData(props.componentId, 'solution', sliderSolution.value);
}, {deep: true});
</script>

<template>
  <v-container>
    <v-row>
      <v-col>
        <v-text-field
            label="Slider Frage"
            v-model="fields.question"
            :rules="[requiredStringRule]"
        ></v-text-field>
      </v-col>
    </v-row>

    <v-row>
      <v-col>
        <v-row>
          <v-col md="3">
            <v-text-field
                label="Minimum"
                v-model="sliderOptions.minValue"
                variant="outlined"
                type="number"
                :max="sliderOptions.maxValue"
                :rules="[requiredNumberRule]"
            ></v-text-field>
          </v-col>
          <v-col md="3">
            <v-text-field
                label="Maximum"
                v-model="sliderOptions.maxValue"
                variant="outlined"
                type="number"
                :min="sliderOptions.minValue"
                :rules="[requiredNumberRule]"
            ></v-text-field>
          </v-col>
          <v-col cols="6">
            <v-text-field
                label="Hinweis"
                v-model="fields.hint"
            ></v-text-field>
          </v-col>
        </v-row>
      </v-col>
      <v-col>
        <v-row>
          <v-col md="3">
            <v-text-field
                label="Richtiger Wert"
                v-model="sliderSolution.correctValue"
                variant="outlined"
                :min="sliderOptions.minValue"
                :max="sliderOptions.maxValue"
                type="number"
                :rules="[requiredNumberRule]"
            ></v-text-field>
          </v-col>
          <v-col md="3">
            <v-text-field
                label="Toleranzbereich"
                v-model="sliderSolution.toleranceValue"
                :min="0"
                :max="sliderSolution.correctValue"
                :rules="[requiredNumberRule]"
                variant="outlined"
                type="number"
            ></v-text-field>
          </v-col>
        </v-row>
      </v-col>
    </v-row>

    <v-row>
      <v-col>
        <div class="text-subtitle-1">Richtige Antwort:</div>
        <v-slider
            v-model="sliderSolution.correctValue"
            :min="sliderOptions.minValue"
            :max="sliderOptions.maxValue"
            :step="sliderOptions.steps"
            color="orange"
            track-color="warning"
            thumb-label>
        </v-slider>
      </v-col>
      <v-col>
        <div class="text-subtitle-1">Aufgaben Vorschau:</div>
        <v-slider
            v-model="previewValue"
            :min="sliderOptions.minValue"
            :max="sliderOptions.maxValue"
            :step="sliderOptions.steps"
            :color="betweenRange(previewValue) ? 'green' : 'orange'"
            :track-color="betweenRange(previewValue) ? 'success' : 'warning'"
            thumb-label>
        </v-slider>
      </v-col>
    </v-row>
    <v-row no-gutters>
      <v-col class="d-flex flex-grow-1 align-end justify-end">
        <Help dialog-type="sliderExplanation"/>
        <div class="mx-1"/>
        <Delete :component-id="props.componentId"/>
      </v-col>
    </v-row>
  </v-container>
</template>