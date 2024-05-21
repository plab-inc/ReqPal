<script setup lang="ts">

interface Props {
  headline?: string,
  text: string,
  color: string
}

const props = defineProps<Props>()

</script>

<template>
  <v-sheet
      :elevation="9"
      :min-height="120"
      :min-width="120"
      :color="color"
      rounded
      class="d-flex flex-column align-center justify-center flex-wrap text-center"
  >
    <div v-if="headline" class="text-h6 text-lg-h5 text-center mb-2">{{ headline }}</div>

    <div class="d-flex align-center justify-center">
      <div class="text-h6 text-sm-h4 text-md-h5 text-lg-h4">
        {{ text }}
      </div>
      <v-icon class="ml-2" size="35" :icon="'mdi-star-four-points-circle-outline'"></v-icon>
    </div>
  </v-sheet>
</template>