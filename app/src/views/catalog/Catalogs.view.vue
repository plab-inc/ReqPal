<template>
  <h1>Meine Kataloge</h1>
  <v-divider></v-divider>
  <v-container>
    <div>
      <div v-if="catalogs.length < 0">
        <div class="text-subtitle-1">Keine Kataloge!</div>
      </div>

      <div v-else>
        <v-row>
          <v-col>
            <v-list>
              <v-list-item
                  v-for="catalog in catalogs"
                  :key="catalog.catalog_id"
                  @click="openCatalogDetails(catalog.catalog_id)"
                  border
                  variant="outlined"
                  rounded
                  min-height="80px"
                  ripple
                  elevation="12"
                  class="ma-5"
              >
                <v-list-item-title>{{ catalog.catalog_name }}</v-list-item-title>
                <template v-slot:prepend>
                  <v-icon>
                    mdi-newspaper-variant
                  </v-icon>
                </template>
              </v-list-item>
            </v-list>
          </v-col>
        </v-row>
      </div>
    </div>
  </v-container>
</template>

<script setup lang="ts">

import {useCatalogStore} from "@/stores/catalog.store.ts";
import router from "@/router/index.ts";

const catalogStore = useCatalogStore();
const catalogs = catalogStore.allCatalogs;

function openCatalogDetails(catalogId: number) {
  router.push({name: "CatalogDetails", params: { catalogId: catalogId }})
}

</script>
  