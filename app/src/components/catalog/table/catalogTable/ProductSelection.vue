<template>
  <v-container class="d-flex align-center">
    <v-select
        v-model="selectedProducts"
        :items="products"
        label="Produkte"
        item-title="product_name"
        item-value="product_id"
        hint="Wähle Produkte für den Katalog aus"
        multiple
        :disabled="products.length <= 0"
    ></v-select>
    <div v-if="products.length <= 0">
      Es stehen noch keine Produkte zur Verfügung.
    </div>
    <div>
      <v-tooltip location="top" text="Produktauswahl speichern">
        <template v-slot:activator="{ props }">
          <v-btn
              v-bind="props"
              class="ml-1"
              density="compact"
              color="success"
              variant="plain"
              size="medium"
              icon="mdi-content-save-outline"
              @click="save"
          />
        </template>
      </v-tooltip>
      <v-tooltip location="bottom" text="Produktauswahl zurücksetzen">
        <template v-slot:activator="{ props }">
          <v-btn
              v-bind="props"
              class="ml-1"
              density="compact"
              color="info"
              variant="plain"
              size="medium"
              icon="mdi-undo"
              @click="rollback"
          />
        </template>
      </v-tooltip>
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

  if (productsToRemove.length === 0 && productsToAdd.length === 0) {
    AlertService.addInfoAlert("Es wurden keine Änderungen vorgenommen.");
    return;
  }

  for (const prId of productsToRemove) {
    await catalogStore.removeProductFromCatalogAndRequirements(prId);
  }
  for (const pr of productsToAdd) {
    await catalogStore.addProductToCatalogAndRequirements(pr);
  }

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