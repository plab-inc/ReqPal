<template>
  <v-row>
    <v-col class="d-flex align-center justify-space-between flex-wrap">
      <h1>User Progress</h1>
      <v-btn variant="plain">Details</v-btn>
    </v-col>
    <v-col>
      <h2>Level 30</h2>
      <v-progress-linear color="primary" model-value="20" :height="12"></v-progress-linear>
    </v-col>
    <v-col class="mt-4">
      <v-timeline direction="horizontal" line-inset="12">
        <v-timeline-item>
          <template v-slot:opposite>
            Lektion 1
          </template>
          100%
        </v-timeline-item>
        <v-timeline-item>
          <template v-slot:opposite>
            60%
          </template>
          Lektion 2
        </v-timeline-item>
        <v-timeline-item>
          <template v-slot:opposite>
            Lektion 3
          </template>
          0%
        </v-timeline-item>
      </v-timeline>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">

</script>
<style scoped>
</style>
