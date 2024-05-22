<script setup lang="ts">

import { ref } from "vue";

interface Props {
  score: number,
  maxScore: number,
  showIcon: boolean
}

const props = defineProps<Props>()
const percentage = ref<number>(0);
const color = ref<string>('success')

if (props.maxScore > 0) {
  percentage.value = (props.score / props.maxScore) * 100;
  if (percentage.value < 80 && percentage.value >= 50) {
    color.value = 'info';
  } else if (percentage.value < 50) {
    color.value = 'warning';
  }
}

</script>

<template>

  <v-progress-circular class="text-h6" :model-value="percentage" :size="180" :width="12" :color="color">
      {{ score + ' / ' + maxScore }}
    <v-icon v-if="showIcon" class="ml-1" size="35" :icon="'mdi-star-four-points-circle-outline'"></v-icon>
  </v-progress-circular>

</template>

<style scoped>

</style>