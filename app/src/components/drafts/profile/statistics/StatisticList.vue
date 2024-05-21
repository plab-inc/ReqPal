<template>
  <v-row>
    <v-col class="d-flex align-center justify-space-between flex-wrap">
      <h1>Statistics</h1>
      <v-btn variant="plain">Details</v-btn>
    </v-col>
    <v-col
        v-for="(item) in items"
        sm="6"
        class="d-flex align-center justify-space-evenly flex-wrap">
      <StatisticItem
          class="flex-grow-1"
          :text="item">
      </StatisticItem>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
import StatisticItem from "@/components/drafts/profile/statistics/StatisticItem.vue";

const items = ['Level 30', '1000 Punkte', '20 Lektionen', '35 ohne Fehler']

</script>
<style scoped>
</style>
