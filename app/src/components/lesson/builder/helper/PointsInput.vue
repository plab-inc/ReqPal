<script setup lang="ts">

import {requiredRule, requiredPositiveNumberBelowMaximumRule, maxPointsPerQuestion} from "@/utils/validationRules.ts";
import {useLessonFormStore} from "@/stores/lessonForm.ts";
import { ref, watch } from "vue";

const props = defineProps<{ componentId: string }>();

const lessonFormStore = useLessonFormStore();
const defaultPoints = 10;
let points = ref<number>(lessonFormStore.getLessonModuleFieldValues(props.componentId, 'points') || defaultPoints);

updateStoreData(points.value);

function updateStoreData(points: any) {
  lessonFormStore.setLessonModuleData(props.componentId, 'points', points);
}

watch(points, (newPoints) => {
  if (newPoints > 0 && newPoints <= maxPointsPerQuestion) {
    updateStoreData(newPoints)
  }
}, {deep: true});

</script>
<template>
  <v-text-field
      label="Maximale Punktzahl"
      variant="outlined"
      type="number"
      hide-details
      :min="0"
      :max="maxPointsPerQuestion"
      clearable
      v-model="points"
      :rules="[requiredRule, requiredPositiveNumberBelowMaximumRule]"
  />
</template>