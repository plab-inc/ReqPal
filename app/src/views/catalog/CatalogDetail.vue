<script setup lang="ts">
import {useCatalogStore} from "@/stores/catalog.ts";
import {Catalog, Product, Requirement} from "@/types/catalog.ts";
import AlertService from "@/services/util/alert.ts";
import { onBeforeMount, ref } from "vue";
import { useRoute } from "vue-router";
import CatalogTable from "@/components/catalog/CatalogTable.vue";

const catalog = ref<Catalog>();
const catalogProducts = ref<Product[]>([]);
const catalogStore = useCatalogStore();
let catalogIdAsNumber: number = 0;

const loading = ref<boolean>(true);
const requirementItems = ref<Requirement[]>([]);

onBeforeMount(async () => {
  const route = useRoute();
  const catalogId = route.params.catalogId as string;

  await catalogStore.getCatalogWithProductsById(catalogId);
  setUpCatalog();
})

function setUpCatalog() {
  loading.value = true;
  if (catalogStore.currentCatalog) {
    catalog.value = catalogStore.currentCatalog;
    if (catalog.value) {
      if (catalog.value.requirements) {
        requirementItems.value = catalog.value.requirements;
      }
      catalogProducts.value = catalog.value.products;
    }
  } else {
    AlertService.addWarningAlert("Kein Katalog gefunden mit der id: " + catalogIdAsNumber);
  }
  loading.value = false;
}
</script>

<template>
  <v-row justify="space-between" align="center" class="mb-1">
    <v-col cols="auto" class="text-h4">
      {{ catalog?.catalog_name }}
    </v-col>
  </v-row>
  <v-divider/>
  <v-container class="mt-2">
    <v-row>
      <v-col>
        <CatalogTable :products="catalogProducts" :loading="loading" :requirement-items="requirementItems"></CatalogTable>
      </v-col>
    </v-row>
  </v-container>
</template>