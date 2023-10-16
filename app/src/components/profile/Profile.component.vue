<template>

  <v-container>
    <UserDetails class="mx-md-16"></UserDetails>
  </v-container>

  <v-divider class="my-8"></v-divider>

  <v-container class="my-8">
    <ProgressSlide class="mx-lg-16"></ProgressSlide>
  </v-container>

  <v-divider></v-divider>

  <v-container class="my-8">
    <v-row>
      <v-col lg="6">
        <StatisticList class="mx-lg-16"></StatisticList>
      </v-col>
      <v-col lg="6">
        <AchievementList class="mx-lg-16"></AchievementList>
      </v-col>
    </v-row>
  </v-container>

</template>

<script setup lang="ts">
import AchievementList from "@/components/profile/achievements/AchievementList.component.vue";
import UserDetails from "@/components/profile/userData/UserDetails.component.vue";
import StatisticList from "@/components/profile/statistics/StatisticList.component.vue";
import ProgressSlide from "@/components/profile/ProgressSlide.component.vue";

</script>
<style scoped>
</style>
