<template>
  <v-container class="border">
    <UserData></UserData>
  </v-container>

  <v-divider class="ma-4"></v-divider>

  <v-container class="border">
    <StatisticList></StatisticList>
  </v-container>

  <v-divider class="ma-4"></v-divider>

  <v-container class="border">
    <AchievementList></AchievementList>
  </v-container>
</template>

<script setup lang="ts">
import AchievementList from "@/components/Profile/Achievements/AchievementList.component.vue";
import UserData from "@/components/Profile/UserData/UserDetails.component.vue";
import StatisticList from "@/components/Profile/Statistics/StatisticList.component.vue";

</script>
<style scoped>

.border {
  border: 1px solid black
}

</style>
