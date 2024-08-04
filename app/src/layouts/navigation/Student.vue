<template>
  <v-list nav class="py-0">
    <v-list-item rounded prepend-icon="mdi-ray-start-vertex-end" title="Szenarien" to="/scenario"
                 :active="router.currentRoute.value.path.startsWith('/scenario')" />
    <v-list-item rounded prepend-icon="mdi-progress-star-four-points" title="Meine Fortschritte" to="/profile" />
  </v-list>
</template>
<script setup lang="ts">
import router from "@/router/index.ts";
</script>