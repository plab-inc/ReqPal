<script setup lang="ts">
import { useCatalogStore } from "@/stores/catalog.ts";
import { onBeforeMount } from "vue";
import { useRoute } from "vue-router";
import CatalogTable from "@/components/catalog/table/CatalogTable.vue";

const catalogStore = useCatalogStore();

onBeforeMount(async () => {
  const route = useRoute();
  const catalogId = route.params.catalogId as string;
  await catalogStore.getFullCatalogById(catalogId);
});

</script>

<template>
  <div v-if="catalogStore.getCurrentCatalog">
    <v-row justify="space-between" align="center" class="mb-1">
      <v-col cols="auto" class="text-h4">
        {{ catalogStore.currentCatalog?.catalog_name }}
      </v-col>
    </v-row>
    <v-divider />
    <v-container class="mt-2">
      <v-row>
        <v-col>
          <CatalogTable />
        </v-col>
      </v-row>
    </v-container>
  </div>
  <div v-else>
    <v-skeleton-loader type="article"></v-skeleton-loader>
  </div>

</template>