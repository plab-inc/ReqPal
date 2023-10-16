<script setup lang="ts">

interface Props {
  componentId: number,
  question: any,
  options: any,
  hint: string | any,
}

const props = defineProps<Props>();

</script>

<template>
  <v-card title="Beschreibung" :text="options" variant="outlined"></v-card>
</template>
