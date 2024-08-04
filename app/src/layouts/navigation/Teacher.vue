<template>
  <v-list nav class="py-0">
    <v-list-item rounded prepend-icon="mdi-text-box-multiple" title="Kataloge" to="/catalog"
                 :active="router.currentRoute.value.path.startsWith('/catalog')" />
    <v-list-item rounded prepend-icon="mdi-invoice-list" title="Produkte" to="/products" />
    <v-divider class="my-1" />
    <v-list-item rounded prepend-icon="mdi-school" title="Lektionen"
                 :active="router.currentRoute.value.path.startsWith('/lesson')" to="/lesson" />
    <v-list-item rounded prepend-icon="mdi-graph-outline" title="Szenarien" to="/scenario"
                 :active="router.currentRoute.value.path.startsWith('/scenario')" />
    <v-divider class="my-1" />
    <v-list-item rounded prepend-icon="mdi-trophy" title="Lernziele" to="/objectives" />
    <v-list-item rounded prepend-icon="mdi-trophy-award" title="Achievements" to="/achievements" />
  </v-list>
</template>

<script lang="ts" setup>
import router from "@/router/index.ts";
</script>