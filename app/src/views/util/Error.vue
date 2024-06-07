<template>
  <v-container class="d-flex align-center justify-center" style="height: 80vh;">
    <v-row justify="center" align="center">
      <v-col cols="3">
        <reqpalCry />
      </v-col>
      <v-col cols="9">
        <div class="text-h1">404</div>
        <p class="text-h4">Diese Seite hat noch nie existiert und wird es auch niemals tun.</p>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import reqpalCry from "@/assets/reqPalCry.svg";
</script>