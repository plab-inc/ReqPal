<template>
  <v-container>
    <v-row>
      <v-col lg="6">
        <v-sheet>
          <Profile></Profile>
        </v-sheet>
      </v-col>

      <v-col lg="6">
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
import Profile from "@/components/Profile/Profile.component.vue";
</script>
