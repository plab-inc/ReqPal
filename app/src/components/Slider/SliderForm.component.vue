<script setup lang="ts">

import {ref} from "vue";
import {useLessonFormStore} from "@/stores/lessonForm.store.ts";
import {noEmptyStringRule, requiredNumberRule} from "@/utils/validationRules.ts";
import {sliderAnswer} from "@/interfaces/Question.interfaces.ts";

const previewValue = ref<number>(0);
const props = defineProps<{ componentId: number }>();
const lessonFormStore = useLessonFormStore();

const defaults: sliderAnswer = {
  id: props.componentId,
  minValue: 0,
  maxValue: 10,
  correctValue: 5,
  tolerance: 0,
  steps: 1
}

function betweenRange(x: number) {
  const min: number = (+fields.value.solutionValues.correctValue) - (+fields.value.solutionValues.tolerance);
  const max: number = (+fields.value.solutionValues.correctValue) + (+fields.value.solutionValues.tolerance);
  return x >= min && x <= max;
}

const fields = ref<any>({
  question: lessonFormStore.getComponentFieldValues(props.componentId, 'question'),
  hint: lessonFormStore.getComponentFieldValues(props.componentId, 'hint'),
  solutionValues: defaults
});

watch(fields, (newFields) => {
  lessonFormStore.setComponentData(props.componentId, 'question', newFields.question);
  lessonFormStore.setComponentData(props.componentId, 'hint', newFields.hint);
  lessonFormStore.setComponentData(props.componentId, 'solution', newFields.solutionValues);
}, {deep: true});

const rules = {
  requiredString: noEmptyStringRule,
  requiredNumber: requiredNumberRule
};

onBeforeMount(() => {
  const data = lessonFormStore.getComponentFieldValues(props.componentId, 'solution');
  if (data) {
    fields.value.solutionValues = data;
  }
})
</script>

<template>
  <v-container>
    <v-row>
      <v-col>
        <v-text-field
            label="Slider Frage"
            v-model="fields.question"
            :rules="[rules.requiredString]"
        ></v-text-field>
      </v-col>
    </v-row>

    <v-row>
      <v-col>
        <v-row>
          <v-col md="3">
            <v-text-field
                label="Minimum"
                v-model="fields.solutionValues.minValue"
                variant="outlined"
                type="number"
                :max="fields.solutionValues.maxValue"
                :rules="[rules.requiredNumber]"
            ></v-text-field>
          </v-col>
          <v-col md="3">
            <v-text-field
                label="Maximum"
                v-model="fields.solutionValues.maxValue"
                variant="outlined"
                type="number"
                :min="fields.solutionValues.minValue"
                :rules="[rules.requiredNumber]"
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
                v-model="fields.solutionValues.correctValue"
                variant="outlined"
                :min="fields.solutionValues.minValue"
                :max="fields.solutionValues.maxValue"
                type="number"
                :rules="[rules.requiredNumber]"
            ></v-text-field>
          </v-col>
          <v-col md="3">
            <v-text-field
                label="Toleranzbereich"
                v-model="fields.solutionValues.tolerance"
                :min="0"
                :max="fields.solutionValues.correctValue"
                variant="outlined"
                type="number"
            ></v-text-field>
          </v-col>
        </v-row>
      </v-col>
    </v-row>

    <v-row>
      <v-col>
        <v-slider
            v-model="fields.solutionValues.correctValue"
            :min="fields.solutionValues.minValue"
            :max="fields.solutionValues.maxValue"
            :step="fields.solutionValues.steps"
            color="orange"
            track-color="warning"
            thumb-label>
        </v-slider>
      </v-col>
      <v-col>
        <div class="text-subtitle-1">Aufgaben Vorschau:</div>
        <v-slider
            v-model="previewValue"
            :min="fields.solutionValues.minValue"
            :max="fields.solutionValues.maxValue"
            :step="fields.solutionValues.steps"
            :color="betweenRange(previewValue) ? 'green' : 'orange'"
            :track-color="betweenRange(previewValue) ? 'success' : 'warning'"
            thumb-label>
        </v-slider>
      </v-col>
    </v-row>
  </v-container>
</template>