<script setup lang="ts">

import {
  requiredRule,
  requiredPositiveNumberBelowMaximumRule,
  maxPointsPerQuestion,
  minPointsPerQuestion
} from "@/utils/validationRules.ts";
import {useLessonFormStore} from "@/stores/lessonForm.ts";
import {ref, watch} from "vue";

const props = withDefaults(defineProps<{ componentId: string, answerAmount?: number }>(), {
  answerAmount: 1
});

const lessonFormStore = useLessonFormStore();
const defaultPoints = 10;
let points = ref<number>(lessonFormStore.getLessonModuleFieldValues(props.componentId, 'points') || defaultPoints);

updateStoreData(points.value);

function updateStoreData(points: any) {
  lessonFormStore.setLessonModuleData(props.componentId, 'points', points);
}

function getPointsText() {
  const pointsPerRightAnswer = lessonFormStore.getAmountOfPointsPerRightAnswer(props.componentId, props.answerAmount);
  return props.answerAmount > 1 ? pointsPerRightAnswer + ' Punkte pro richtiger Antwort' : pointsPerRightAnswer + ' Punkte bei richtiger Antwort';
}

watch(points, (newPoints) => {
  if (newPoints > 0 && newPoints <= maxPointsPerQuestion) {
    updateStoreData(newPoints)
  }
}, {deep: true});
</script>
<template>
  <div class="d-flex justify-start align-center flex-grow-1">
    <v-text-field
        label="Maximale Punktzahl"
        variant="outlined"
        type="number"
        hide-details
        :min="minPointsPerQuestion"
        :max="maxPointsPerQuestion"
        clearable
        v-model="points"
        :rules="[requiredRule, requiredPositiveNumberBelowMaximumRule]"
    />
    <div class="mx-1"/>
    <v-tooltip
        :text="getPointsText()"
        location="right">
      <template v-slot:activator="{ props }">
        <v-icon v-bind="props" icon="mdi-information-outline" color="primary">
        </v-icon>
      </template>
    </v-tooltip>
  </div>
</template>