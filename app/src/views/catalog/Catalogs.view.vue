<template>
  <v-container>
    <div class="text-md-h3 text-sm-h4 text-h6">Alle Kataloge</div>

    <div>
      <div v-if="catalogs.length < 0">
        <div class="text-subtitle-1">Keine Kataloge!</div>
      </div>

      <div v-else>
        <v-list dense>
          <v-list-item
              v-for="catalog in catalogs"
              :key="catalog.catalog_id"
              :to="{ name: 'CatalogDetails', params: { catalogId: catalog.catalog_id } }"
          >
            <template v-slot:prepend>
              {{ catalog.catalog_name }}
            </template>
          </v-list-item>
        </v-list>
      </div>
    </div>
  </v-container>
</template>

<script setup lang="ts">

import {useCatalogStore} from "@/stores/catalog.store.ts";

const catalogStore = useCatalogStore();
const catalogs = catalogStore.allCatalogs;

</script>
  