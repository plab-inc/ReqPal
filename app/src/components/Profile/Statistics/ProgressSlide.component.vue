<template>
  <v-window show-arrows>
    <v-window-item>
      <UserProgress class="mx-16"></UserProgress>
    </v-window-item>
    <v-window-item>
      <CompanyDetails class="mx-16"></CompanyDetails>
    </v-window-item>
  </v-window>
</template>

<script setup lang="ts">
import UserProgress from "@/components/Profile/Statistics/UserProgress.component.vue";
import CompanyDetails from "@/components/Profile/Company/CompanyDetails.component.vue";
</script>

<style scoped>
</style>
