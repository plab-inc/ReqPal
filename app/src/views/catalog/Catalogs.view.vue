<template>
  <v-container>
    <h1>Alle Kataloge</h1>

    <v-row v-for="catalog in catalogs">
      <v-col>
        <v-card class="pa-5" @click="redirectToCatalogDetails(catalog.catalog_id)">
          <v-card-title>
            {{ catalog.catalog_name }}
          </v-card-title>
          <v-card-text>
            {{ 'Katalog: ' + catalog.catalog_id }}
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">

import {useCatalogStore} from "@/stores/catalog.store.ts";
import router from "@/router";
import {dbCatalog} from "@/types/catalog.types.ts";
import AlertService from "@/services/alert.service.ts";
import {useUtilStore} from "@/stores/util.store.ts";

const utilStore = useUtilStore();
const catalogStore = useCatalogStore();
const catalogs = ref<dbCatalog[]>();
function redirectToCatalogDetails(catalogId: number) {
  router.push({name: 'CatalogDetails', params: {catalogId: catalogId}});
}

onBeforeMount(async () => {
  utilStore.toggleLoadingBar();
  try {
    await catalogStore.getAllCatalogs();
    catalogs.value = catalogStore.allCatalogs;
  } catch (error: any) {
    AlertService.addErrorAlert("Fehler beim Laden: + " + error.message)
  }
  utilStore.toggleLoadingBar();
})

</script>
  