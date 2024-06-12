<template>
  <v-container fluid>
    <div class="text-subtitle-1 mb-2">Produkte vom Katalog</div>
    <div class="d-flex flex-row align-center justify-space-around">
      <div v-for="product in products" :key="product.product_id">
        <v-checkbox
            v-model="selectedProducts"
            :label="product.product_name"
            :value="product.product_id"
        ></v-checkbox>
      </div>
    </div>
    <div class="d-flex flex-row justify-end">
      <v-btn
          class="ml-1"
          density="compact"
          color="success"
          variant="plain"
          size="medium"
          icon="mdi-content-save-outline"
          @click="save"
      />
      <v-btn
          class="ml-1"
          density="compact"
          color="success"
          variant="plain"
          size="medium"
          icon="mdi-undo"
          @click="rollback"
      />
    </div>
  </v-container>
</template>

<script setup lang="ts">
import {onBeforeMount, ref} from "vue";
import {Product} from "@/types/catalog.ts";
import AlertService from "@/services/util/alert.ts";
import {useProductStore} from "@/stores/product.ts";
import {useCatalogStore} from "@/stores/catalog.ts";

const catalogStore = useCatalogStore();
const products = ref<Product[]>([]);

const productStore = useProductStore();

const productsForCatalog = ref<Product[]>([]);
const selectedProducts = ref<string[]>([]);

async function save() {
  let productsToAdd: Product[] = [];

  selectedProducts.value.forEach(selection => {
    const foundProduct = productsForCatalog.value.find(pr => pr.product_id === selection);
    if (!foundProduct) {
      const toAdd = products.value.find(pr => pr.product_id === selection);
      if (toAdd) {
        productsToAdd.push(toAdd);
      }
    }
  })

  let productsToRemove: string[] = [];

  productsForCatalog.value.forEach(originalProduct => {
    const foundProduct = selectedProducts.value.find(id => id === originalProduct.product_id);
    if (!foundProduct) {
      productsToRemove.push(originalProduct.product_id);
    }
  })

  productsToRemove.forEach(prId => {
    catalogStore.removeProductFromCatalogAndRequirements(prId);
  })
  productsToAdd.forEach(pr => {
    catalogStore.addProductToCatalogAndRequirements(pr);
  })
  AlertService.addSuccessAlert("Produkte vom Katalog aktualisiert.")
}

async function rollback() {
  refreshProducts();
  AlertService.addSuccessAlert("Änderungen zurückgesetzt.")
}

function refreshProducts() {
  if (catalogStore.getCurrentCatalog) {
    productsForCatalog.value = [];
    productsForCatalog.value = catalogStore.getCurrentCatalog?.products;
    products.value = productStore.getCurrentProducts;
    selectedProducts.value = [];
    productsForCatalog.value.forEach(pr => {
      selectedProducts.value.push(pr.product_id);
    })
  }
}

onBeforeMount(async () => {
  refreshProducts();
})
</script>