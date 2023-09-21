<template>
  <v-row>
    <v-col>
      <h1>Statistics</h1>
    </v-col>
    <v-col class="d-flex align-center justify-space-evenly flex-wrap">
      <StatisticItem
          v-for="(item, index) in items"
          :key="index"
          :highlight="index % 2 === 0"
          :text="item">
      </StatisticItem>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
import StatisticItem from "@/components/Profile/Statistics/StatisticItem.component.vue";

const items = ['1000 Punkte', '20 Lektionen', '35 ohne Fehler', '20 Lektionen', '1000 Punkte',
  '35 ohne Fehler', '20 Lektionen', '1000 Punkte']

</script>
<style scoped>
</style>
