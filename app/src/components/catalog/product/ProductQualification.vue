<script setup lang="ts">
interface Props {
  qualification: string,
  size: number
}

const props = defineProps<Props>();

const getProgressColor = (qualification: string) => {
  switch (parseInt(qualification)) {
    case 5:
      return 'green';
    case 4:
      return 'light-green';
    case 3:
      return 'yellow';
    case 2:
      return 'orange';
    case 1:
      return 'red';
    default:
      return 'grey'; // default color in case of any unforeseen values
  }
};
</script>

<template>
  <v-progress-circular
      v-if="qualification"
      :size="size"
      :width="7"
      :color="getProgressColor(qualification)"
      :model-value="(parseInt(qualification) / 5 ) * 100"
  >
    {{ qualification }}
  </v-progress-circular>
</template>

<style scoped>

</style>