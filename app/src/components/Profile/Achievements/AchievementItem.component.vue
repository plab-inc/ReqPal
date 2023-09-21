<template>
  <v-row class="pa-3 ma-3 item d-flex align-center justify-center">
    <v-col sm="1" class="d-flex justify-center">
      <v-icon size="x-large">
        mdi-trophy
      </v-icon>
    </v-col>
    <v-col sm="11">
      <h1 class="text-center">{{ text }}</h1>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">

interface Props {
  text: String
}

const props = defineProps<Props>();

</script>
<style scoped>

.item {
  border: 2px solid white;
  border-radius: 40px;
  width: 100%;
}

</style>
