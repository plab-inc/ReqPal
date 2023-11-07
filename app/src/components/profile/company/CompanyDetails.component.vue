<template>
  <v-container>
    <v-row>
      <v-col order="1" order-md="2" md="4" class="d-flex flex-column justify-center align-center">
        <v-avatar class="profileData"
                  color="secondary"
                  alt="profilePicture"
                  size="160"></v-avatar>
        <h1 class="text-center">Company Name</h1>
      </v-col>
      <v-col order="2" order-md="1" md="8">
          <CompanyProgress></CompanyProgress>
      </v-col>
    </v-row>
  </v-container>

</template>

<script setup lang="ts">
import CompanyProgress from "@/components/profile/company/CompanyProgress.component.vue";
</script>

<style scoped>

.profileData {
  margin: 5px 0 5px 0;
}

</style>
