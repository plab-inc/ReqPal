<script setup lang="ts">

import {Product} from "@/types/catalog.ts";
import ProductItem from "@/components/catalog/product/ProductItem.vue";
import {onBeforeMount, ref} from "vue";
import {useCatalogStore} from "@/stores/catalog.ts";
import EditProducts from "@/components/catalog/product/EditProducts.vue";
import alertService from "@/services/util/alert.ts";
import AddProducts from "@/components/catalog/product/AddProducts.vue";

const catalogStore = useCatalogStore();
const products = ref<Product[]>([]);
const page = ref(1);
const selectedProduct = ref<Product>();

const editDialog = ref(false);
const addDialog = ref(false);

function openEditDialog() {
  editDialog.value = true;
}

function addProduct() {
  addDialog.value = true;
}

function updateEditDialog(value: boolean) {
  editDialog.value = value;
}

function updateAddDialog(value: boolean) {
  addDialog.value = value;
}

async function removeProductFromCatalog() {
  console.log("removing... " + selectedProduct.value?.product_name)
  if (selectedProduct.value?.product_id) {
    await catalogStore.removeProductFromCatalogAndRequirements(selectedProduct.value?.product_id);
    alertService.addSuccessAlert("Produkt wurde vom Katalog entfernt.")
    refreshProducts();
  }
}

async function openDialog(product: Product) {

  if (product) {
    selectedProduct.value = product;
    alertService.openDialog("Produkt entfernen",
        "Wollen Sie wirklich das Produkt " + selectedProduct.value.product_name +
        " von diesem Katalog entfernen? Das Produkt wird nicht vollständig gelöscht.",
        "Entfernen", "Abbrechen", removeProductFromCatalog)
  } else {
    alertService.addWarningAlert("Es wurde kein Produkt ausgewählt.")
  }
}

function refreshProducts() {
  if (catalogStore.getCurrentCatalog) {
    products.value = [];
    products.value = catalogStore.getCurrentCatalog?.products;
  }
}

onBeforeMount(async () => {
  refreshProducts();
})
</script>

<template>
  <div>
    <v-expansion-panels>
      <v-expansion-panel title="Produkte">
        <v-expansion-panel-text>
          <div class="d-flex align-center justify-end">
            <v-btn
                class="ml-1"
                density="compact"
                color="success"
                variant="plain"
                size="medium"
                icon="mdi-pencil"
                @click.stop="openEditDialog"
            />
            <v-btn
                class="ml-1"
                density="compact"
                color="success"
                variant="plain"
                size="medium"
                icon="mdi-plus"
                @click.stop="addProduct"
            />
          </div>

          <div v-if="products.length > 0">
            <v-data-iterator :items="products" :items-per-page="3" :page="page">

              <template v-slot:default="{ items }">
                <v-row>
                  <template
                      v-for="(item) in items"
                      :key="item.raw.product_id"
                  >
                    <v-col cols="4">
                      <v-row>
                        <v-col sm="11">
                          <ProductItem :product="item.raw"></ProductItem>
                        </v-col>
                        <v-col sm="1">
                          <v-btn
                              density="compact"
                              color="error"
                              variant="plain"
                              size="medium"
                              icon="mdi-minus-circle-outline"
                              @click="openDialog(item.raw)"></v-btn>
                        </v-col>
                      </v-row>
                    </v-col>
                  </template>
                </v-row>
              </template>

              <template v-slot:footer="{ page, pageCount, prevPage, nextPage }">
                <div class="d-flex align-center justify-center pa-4">
                  <v-btn
                      :disabled="page === 1"
                      density="comfortable"
                      icon="mdi-arrow-left"
                      variant="tonal"
                      rounded
                      @click="prevPage"
                  ></v-btn>

                  <div class="mx-2 text-caption">
                    Page {{ page }} of {{ pageCount }}
                  </div>

                  <v-btn
                      :disabled="page >= pageCount"
                      density="comfortable"
                      icon="mdi-arrow-right"
                      variant="tonal"
                      rounded
                      @click="nextPage"
                  ></v-btn>
                </div>
              </template>
            </v-data-iterator>
          </div>

          <v-row v-if="products.length <= 0">
            <v-col>
              <p>Diesem Katalog wurden noch keine Produkte zugeordnet!</p>
            </v-col>
          </v-row>

        </v-expansion-panel-text>
      </v-expansion-panel>
    </v-expansion-panels>
    <EditProducts v-if="editDialog" :dialog="editDialog" :products="products" @update:dialog="updateEditDialog"/>
    <AddProducts v-if="addDialog" :dialog="addDialog" :products="products" @productsAdded="refreshProducts"
                 @update:dialog="updateAddDialog"/>
  </div>
</template>