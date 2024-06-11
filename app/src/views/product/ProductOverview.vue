<template>
  <v-row justify="space-between" align="center" class="mb-1">
    <v-col cols="auto" class="text-h4">
      Meine Produkte ({{ productStore.products.length }}/{{ MAX_PRODUCTS }})
    </v-col>
    <v-col cols="auto">
      <v-btn-group
          elevation="3"
          variant="outlined"
          rounded
          divided
      >
        <v-tooltip text="Neues Produkt" location="bottom">
          <template v-slot:activator="{ props }">
            <v-btn
                v-bind="props"
                @click="createProduct"
                :disabled="productStore.products.length >= MAX_PRODUCTS"
            >
              Neues Produkt Erstellen
            </v-btn>
          </template>
        </v-tooltip>
      </v-btn-group>
    </v-col>
  </v-row>
  <v-divider />

  <v-row>
    <v-col>
     <ProductTable></ProductTable>
    </v-col>
  </v-row>
  <EditProduct v-if="editDialog" :dialog="editDialog" @update:dialog="updateEditDialog"></EditProduct>
</template>

<script setup lang="ts">

import ProductTable from "@/components/catalog/table/ProductTable.vue";
import {useProductStore} from "@/stores/product.ts";
import {useAuthStore} from "@/stores/auth.ts";
import {ref} from "vue";
import EditProduct from "@/components/catalog/product/EditProduct.vue";

const MAX_PRODUCTS = 10;
const productStore = useProductStore();
const authStore = useAuthStore();
const editDialog = ref<boolean>(false);

function updateEditDialog(value: boolean) {
  editDialog.value = value;
}

async function createProduct() {
  if(authStore.user?.id){
    productStore.currentProduct = null;
    editDialog.value = true;
  }
}
</script>
