<script setup lang="ts">

interface Props {
  text: string,
  color: string
}

const props = defineProps<Props>()

</script>

<template>
  <v-sheet
      :elevation="9"
      :min-height="150"
      :min-width="150"
      :color="color"
      rounded
      class="d-flex align-center justify-center flex-wrap text-center"
  >
    <div class="text-h6 text-sm-h4 text-md-h5 text-lg-h4">
      {{ text }}
    </div>
    <v-icon class="ml-2" size="35" :icon="'mdi-star-four-points-circle-outline'"></v-icon>

  </v-sheet>
</template>

<style scoped>

</style>