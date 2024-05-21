<template>
  <v-row>
    <v-col class="d-flex align-center justify-space-between flex-wrap">
      <h1>Company Progress</h1>
      <v-btn variant="plain">Details</v-btn>
    </v-col>
    <v-col>
      <h2>Level 6</h2>
      <v-progress-linear color="primary" model-value="50" :height="12"></v-progress-linear>
    </v-col>
    <v-col>
      <h2>Zufriedenheit</h2>
      <v-progress-linear color="primary" model-value="80" :height="12"></v-progress-linear>
    </v-col>
    <v-col>
      <h2>Unzufriedenheit</h2>
      <v-progress-linear color="primary" model-value="20" :height="12"></v-progress-linear>
    </v-col>
    <v-col>
      <h2>Gewinne</h2>
      <v-progress-linear color="primary" model-value="100" :height="12"></v-progress-linear>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
</script>

<style scoped>
</style>
