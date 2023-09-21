<template>

  <v-container>
    <UserDetails></UserDetails>
  </v-container>

  <v-divider class="mt-4"></v-divider>

  <v-container>
    <UserProgress></UserProgress>
  </v-container>

  <v-divider class="mt-4"></v-divider>

  <v-container>
    <StatisticList></StatisticList>
  </v-container>

  <v-divider class="mt-4"></v-divider>

  <v-container>
    <AchievementList></AchievementList>
  </v-container>
</template>

<script setup lang="ts">
import AchievementList from "@/components/Profile/Achievements/AchievementList.component.vue";
import UserDetails from "@/components/Profile/UserData/UserDetails.component.vue";
import StatisticList from "@/components/Profile/Statistics/StatisticList.component.vue";
import UserProgress from "@/components/Profile/Statistics/Progress.component.vue";

</script>
<style scoped>
</style>
