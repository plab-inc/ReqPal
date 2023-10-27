<script setup lang="ts">

interface Props {
  score: number,
  maxScore: number
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

  <v-progress-circular :model-value="percentage" :size="250" :width="12" :color="color">
    <div class="text-h6 text-sm-h5 text-md-h5 text-lg-h4">
      {{ score + ' / ' + maxScore }}
    </div>
    <v-icon class="ml-1" size="35" :icon="'mdi-star-four-points-circle-outline'"></v-icon>
  </v-progress-circular>

</template>

<style scoped>

</style>