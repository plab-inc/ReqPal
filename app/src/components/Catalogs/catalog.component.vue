<script setup lang="ts">
import {useCatalogStore} from "@/stores/catalog.store.ts";
import {Catalog, Requirement} from "@/types/catalog.types.ts";

const catalog = ref<Catalog>();
const catalogStore = useCatalogStore();
const loading = ref<boolean>(true);
const items = ref<Requirement[]>([]);
const themeColor = "#6e4aff";
const itemsSelected = ref([]);

const selectedProduct = ref("MIRO");
let colSize = 3;
let firstCol = 1;
if (catalog.value?.products) {
  colSize = (12 - firstCol) / catalog.value?.products.length;
}

const headers = [
  {text: 'ID', value: 'requirement_id', sortable: true},
  {text: 'Requirement', value: 'reqId', sortable: true},
  {text: 'Titel', value: 'title', sortable: true},
  {text: 'Beschreibung', value: 'description', sortable: true},
  {text: 'Qualifizierung', value: 'productQualification', sortable: true},
  {text: 'Kommentar', value: 'productComment', sortable: true},
]

function onSelectProduct(name: string) {
  selectedProduct.value = name;
}

onBeforeMount(async () => {
  await catalogStore.getWholeCatalogById(171);
  if (catalogStore.currentCatalog) {
    catalog.value = catalogStore.currentCatalog;
    if (catalog.value?.requirements) {
      items.value = catalog.value.requirements;
      loading.value = false;
    }
  }
})
</script>

<template>
  <h1>{{ catalog?.catalog_name }}</h1>
  <p>{{selectedProduct}}</p>

<p> {{items[0].products[selectedProduct]}}</p>

  <v-item-group mandatory>
    <v-container>
      <v-row>
        <v-col
            :md="firstCol">
          Products:
        </v-col>
        <v-col
            v-for="product in catalog?.products"
            :key="product.product_id"
            :md="colSize"
        >
          <v-item v-slot="{ isSelected, toggle }">
            <v-card
                :color="isSelected ? 'primary' : ''"
                class="d-flex align-center"
                dark
                height="75"
                @click="() => { if (toggle) { toggle(); } onSelectProduct(product.product_name); }"
            >
              <v-scroll-y-transition>
                <div
                    class="text-h4 flex-grow-1 text-center"
                >
                  {{ product.product_name }}
                </div>
              </v-scroll-y-transition>
            </v-card>
          </v-item>
        </v-col>
      </v-row>
    </v-container>
  </v-item-group>

  <EasyDataTable
      v-model:itemsSelected="itemsSelected"
      :headers="headers"
      :items="items"
      :loading="loading"
      :theme-color="themeColor"
      table-class-name="customize-table">

    <template #item-productQualification="item">
      {{ item.products[selectedProduct]?.qualification }}
    </template>

    <template #item-productComment="item">
      {{ item.products[selectedProduct]?.comment }}
    </template>

  </EasyDataTable>

</template>

<style scoped>

.customize-table {
  --easy-table-border: 1px solid #445269;
  --easy-table-row-border: 1px solid #445269;

  --easy-table-header-font-size: 14px;
  --easy-table-header-height: 50px;
  --easy-table-header-font-color: #c1cad4;
  --easy-table-header-background-color: #2d3a4f;

  --easy-table-header-item-padding: 10px 15px;

  --easy-table-body-even-row-font-color: #fff;
  --easy-table-body-even-row-background-color: #4c5d7a;

  --easy-table-body-row-font-color: #c0c7d2;
  --easy-table-body-row-background-color: #2d3a4f;
  --easy-table-body-row-height: 50px;
  --easy-table-body-row-font-size: 14px;

  --easy-table-body-row-hover-font-color: #2d3a4f;
  --easy-table-body-row-hover-background-color: #eee;

  --easy-table-body-item-padding: 10px 15px;

  --easy-table-footer-background-color: #2d3a4f;
  --easy-table-footer-font-color: #c0c7d2;
  --easy-table-footer-font-size: 14px;
  --easy-table-footer-padding: 0px 10px;
  --easy-table-footer-height: 50px;

  --easy-table-rows-per-page-selector-width: 70px;
  --easy-table-rows-per-page-selector-option-padding: 10px;
  --easy-table-rows-per-page-selector-z-index: 1;

  --easy-table-scrollbar-track-color: #2d3a4f;
  --easy-table-scrollbar-color: #2d3a4f;
  --easy-table-scrollbar-thumb-color: #4c5d7a;;
  --easy-table-scrollbar-corner-color: #2d3a4f;

  --easy-table-loading-mask-background-color: #2d3a4f;
}
</style>