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
  <v-card variant="outlined">
    <v-card-text class="text-h5">
      {{ options }}
    </v-card-text>
  </v-card>
</template>
