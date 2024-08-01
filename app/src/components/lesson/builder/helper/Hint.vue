<script setup lang="ts">

interface Props {
  questionId: string,
  hint: string
}

const props = defineProps<Props>();

</script>

<template>
  <v-tooltip :text="'Hinweis'" location="top" v-if="hint.trim() !== ''">
    <template v-slot:activator="{ props }">
      <v-btn v-bind="props"
             :elevation="8"
             size="40"
             color="warning"
             icon="mdi-lightbulb-on-outline" />
    </template>
  </v-tooltip>
</template>

<style scoped>

</style>