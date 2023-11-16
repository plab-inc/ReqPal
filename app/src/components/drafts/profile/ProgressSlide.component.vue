<template>
  <v-window show-arrows>
    <v-window-item>
      <UserProgress class="mr-16"></UserProgress>
    </v-window-item>
    <v-window-item>
      <CompanyDetails class="ml-16"></CompanyDetails>
    </v-window-item>
  </v-window>
</template>

<script setup lang="ts">
import UserProgress from "@/components/drafts/profile/userData/UserProgress.component.vue";
import CompanyDetails from "@/components/drafts/profile/company/CompanyDetails.component.vue";
</script>

<style scoped>
</style>
