<template>
  <v-container>
    <h1>Alle Kataloge</h1>

    <v-row v-for="n in 4">
      <v-col>
        <v-card class="pa-5" @click="redirectToCatalogDetails(171)">
          <v-card-title>
            Catalog Name
          </v-card-title>
          <v-card-text>
            Catalog Text
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">

import {useCatalogStore} from "@/stores/catalog.store.ts";
import router from "@/router";
const catalogStore = useCatalogStore();

function redirectToCatalogDetails(catalogId: number) {
  router.push({name: 'CatalogDetails', params: {catalogId: catalogId}});
}

</script>
  