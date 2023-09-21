<template>

  <v-container>
    <UserDetails class="mx-md-16"></UserDetails>
  </v-container>

  <v-divider class="mt-4"></v-divider>

  <v-container class="mt-8">
    <ProgressSlide class="mx-md-16"></ProgressSlide>
  </v-container>

  <v-divider class="mt-4"></v-divider>

  <v-container class="mt-8">
    <StatisticList class="mx-md-16"></StatisticList>
  </v-container>

  <v-divider class="mt-4"></v-divider>

  <v-container class="mt-8">
    <AchievementList class="mx-md-16"></AchievementList>
  </v-container>
</template>

<script setup lang="ts">
import AchievementList from "@/components/Profile/Achievements/AchievementList.component.vue";
import UserDetails from "@/components/Profile/UserData/UserDetails.component.vue";
import StatisticList from "@/components/Profile/Statistics/StatisticList.component.vue";
import ProgressSlide from "@/components/Profile/ProgressSlide.component.vue";

</script>
<style scoped>
</style>
