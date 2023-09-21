<template>
  <h1>Statistics</h1>
  <div class="itemContainer">
    <StatisticItem
        v-for="(item, index) in items"
        :key="index"
        :highlight="index % 2 === 0"
        :text="item">
    </StatisticItem>
  </div>
</template>

<script setup lang="ts">
import StatisticItem from "@/components/Profile/Statistics/StatisticItem.component.vue";

const items = ['1000 Punkte', '20 Lektionen', '35 ohne Fehler', '20 Lektionen', '1000 Punkte',
  '35 ohne Fehler', '20 Lektionen', '1000 Punkte']

</script>
<style scoped>

.itemContainer {
  border: 1px solid black;
  padding: 10px 20px 10px 20px;
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
  align-items: center;
  flex-flow: wrap;
}

</style>
