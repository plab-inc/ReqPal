<script setup lang="ts">

interface Props {
  componentId: number,
  question: string | any,
  options: any,
  hint: string | any,
}

const props = defineProps<Props>();
const textInput = ref<string>();
</script>

<template>
  <v-textarea v-model="textInput"
              :label="options"
              variant="outlined"
              auto-grow></v-textarea>
</template>