<template>
  <v-select
      chips
      v-model="selectedProducts"
      :items="products"
      density="comfortable"
      label="Produkte"
      item-title="product_name"
      item-value="product_id"
      multiple
      variant="outlined"
      no-data-text="Es stehen noch keine Produkte zur Verfügung."
      :disabled="!userCanEdit || products.length <= 0 || isProcessing"
  >
    <template v-slot:chip="{ item }">
      <v-chip
          density="comfortable"
          color="primary"
          variant="outlined"
      >
        {{ item.title }}
      </v-chip>
    </template>
    <template v-if="hasChanged" v-slot:append>
      <v-btn
          density="compact"
          color="success"
          variant="plain"
          size="medium"
          icon="mdi-content-save"
          @click="save"
          :disabled="isProcessing"
      />
      <v-btn
          class="ml-2"
          density="compact"
          color="error"
          variant="plain"
          size="medium"
          icon="mdi-undo"
          @click="rollback"
          :disabled="isProcessing"
      />
    </template>
  </v-select>
</template>

<script setup lang="ts">
import { onBeforeMount, ref, watch } from "vue";
import { Product } from "@/types/catalog.ts";
import AlertService from "@/services/util/alert.ts";
import { useProductStore } from "@/stores/product.ts";
import { useCatalogStore } from "@/stores/catalog.ts";
import { useAuthStore } from "@/stores/auth.ts";

const catalogStore = useCatalogStore();
const products = ref<Product[]>([]);

const productStore = useProductStore();

const productsForCatalog = ref<Product[]>([]);
const selectedProducts = ref<string[]>([]);
const originalSelectedProducts = ref<string[]>([]);
const hasChanged = ref<boolean>(false);
const isProcessing = ref<boolean>(false);
const userOwnsCatalog = ref<boolean>(false);
const userCanEdit = ref<boolean>(false);
const authStore = useAuthStore();

function checkIfSelectionHasChanged() {

  if (selectedProducts.value.length > originalSelectedProducts.value.length || selectedProducts.value.length < originalSelectedProducts.value.length) {
    return true;
  }

  for (let pr of selectedProducts.value) {
    const found = originalSelectedProducts.value.find(p => p === pr);
    if (!found) {
      return true;
    }
  }
  return false;
}

async function save() {
  isProcessing.value = true;
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

  refreshProducts();
  AlertService.addSuccessAlert("Produkte vom Katalog aktualisiert.")
  isProcessing.value = false;
}

async function rollback() {
  isProcessing.value = true;
  refreshProducts();
  isProcessing.value = false;
}

function refreshProducts() {
  const catalog = catalogStore.getCurrentCatalog;
  if (catalog) {
    if (userOwnsCatalog.value) {
      products.value = productStore.getCurrentProducts;
    } else {
      products.value = catalogStore.getCurrentCatalog.products;
    }

    productsForCatalog.value = catalog.products || [];
    selectedProducts.value = originalSelectedProducts.value = productsForCatalog.value.map(pr => pr.product_id);
  }
  hasChanged.value = false;
}

onBeforeMount(async () => {
  if (catalogStore.currentCatalog?.user_id === authStore.user?.id) {
    userOwnsCatalog.value = true;
    userCanEdit.value = true;
  }

  if (authStore.isModerator) {
    userCanEdit.value = true;
  }
  refreshProducts();
})

watch(selectedProducts, () => {
  hasChanged.value = checkIfSelectionHasChanged();
}, {deep: true});
</script>