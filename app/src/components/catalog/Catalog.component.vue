<script setup lang="ts">
import {useCatalogStore} from "@/stores/catalog.store.ts";
import {Catalog, Product, Requirement} from "@/types/catalog.types.ts";
import AlertService from "@/services/util/alert.service.ts";
import ProdutDetailPanel from "@/components/catalog/product/ProdutDetailPanel.component.vue";
import RequirementItem from "@/components/catalog/requirement/RequirementItem.component.vue";
import CatalogTable from "@/components/catalog/CatalogTable.component.vue";

const catalog = ref<Catalog>();
const catalogProducts = ref<Product[]>([]);
const catalogStore = useCatalogStore();
let catalogIdAsNumber: number = 0;

const loading = ref<boolean>(true);
const loadingBar = ref<boolean>(false);

const requirementItems = ref<Requirement[]>([]);
const selectedRequirement = ref<Requirement>();
const reqGroupSelection = ref<Requirement[]>([]);

async function onRowClick(item: Requirement) {
  selectedRequirement.value = item;
  await getProductDetails();
}

async function getProductDetails() {
  loadingBar.value = true;
  try {
    if (selectedRequirement.value) {
      await catalogStore.getProductDetailsForRequirement(selectedRequirement.value);
    }
  } catch (error: any) {
    AlertService.addErrorAlert("Fehler beim Abrufen der Produktdetails: " + error.message);
  }
  loadingBar.value = false;
}

onBeforeMount(async () => {
  const route = useRoute();
  const catalogId = route.params.catalogId as string;
  catalogIdAsNumber = parseInt(catalogId, 10);

  await catalogStore.getCatalogWithProductsById(catalogIdAsNumber);
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
  <v-container>
    <v-row>
      <v-col>
        <div class="text-md-h3 text-sm-h4 text-h6">{{ catalog?.catalog_name }}</div>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <RequirementItem :requirement="selectedRequirement"></RequirementItem>
      </v-col>
      <v-col>
        <ProdutDetailPanel :requirement="selectedRequirement" :products="catalogProducts"
                           :loading="loadingBar"></ProdutDetailPanel>
      </v-col>
    </v-row>

    <v-row>
      <v-col>
        <CatalogTable :loading="loading" :requirement-items="requirementItems" v-model="reqGroupSelection"
                      :selectable="false"
                      @on-row-click="onRowClick"
        ></CatalogTable>
      </v-col>
    </v-row>
  </v-container>
</template>
