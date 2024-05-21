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
import AchievementList from "@/components/drafts/profile/achievements/AchievementList.vue";
import UserDetails from "@/components/drafts/profile/userData/UserDetails.vue";
import StatisticList from "@/components/drafts/profile/statistics/StatisticList.vue";
import ProgressSlide from "@/components/drafts/profile/ProgressSlide.vue";
</script>
<style scoped>
</style>
