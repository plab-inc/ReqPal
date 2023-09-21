<template>
  <v-container>
    <v-row>
      <v-col md="6">
        <v-sheet>
          <h1>Profile</h1>
          <Profile></Profile>
        </v-sheet>
      </v-col>

      <v-col md="6">
        <v-sheet>
          <v-container>
            <h1>Company Data</h1>
          </v-container>
        </v-sheet>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import Upload from "@/components/Upload.component.vue";
import Profile from "@/components/Profile/Profile.component.vue";
</script>
