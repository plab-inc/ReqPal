<template>
  <v-row justify="space-between" align="center" class="mb-1">
    <v-col cols="auto" class="text-h4">
      Meine Produkte ({{ products.length }}/{{ MAX_PRODUCTS }})
    </v-col>
  </v-row>
  <v-divider/>
  <v-row>
    <v-col>
      <v-list>
        <v-list-item
            v-for="exampleProduct in exampleProducts"
            :key="exampleProduct.product_id"
            border
            variant="outlined"
            rounded
            base-color="info"
            min-height="80px"
            ripple
            elevation="7"
            class="ma-5"
            subtitle="Beispielprodukte"
            @click="openProductDetails(exampleProduct)"
        >
          <v-list-item-title>{{ exampleProduct.product_name }}</v-list-item-title>
          <template v-slot:prepend>
            <v-icon>
              mdi-invoice-list
            </v-icon>
          </template>
          <template v-slot:append>
            <v-btn-group
                variant="outlined"
                elevation="24"
                divided
                density="default"
            >
            </v-btn-group>
          </template>
        </v-list-item>
      </v-list>
      <v-divider></v-divider>
      <v-list>
        <v-list-item
            v-for="product in products"
            :key="product.product_id"
            border
            variant="outlined"
            rounded
            min-height="80px"
            ripple
            elevation="12"
            class="ma-5"
            @click="openProductDetails(product)"
        >
          <v-list-item-title>{{ product.product_name }}</v-list-item-title>
          <template v-slot:prepend>
            <v-icon>
              mdi-invoice-list
            </v-icon>
          </template>
          <template v-slot:append>
            <v-btn-group
                variant="outlined"
                elevation="24"
                divided
                density="default"
            >
              <v-btn
                  color="error"
              >
                Löschen
              </v-btn>
            </v-btn-group>
          </template>
        </v-list-item>
      </v-list>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">

import router from "@/router";
import {onBeforeMount, ref} from "vue";
import {Product} from "@/types/catalog.ts";
import ProductService from "@/services/database/products.ts";

const MAX_PRODUCTS = 10;
const products = ref<Product[]>([]);
const exampleProducts = ref<Product[]>([]);

async function openProductDetails(product: Product) {
  if(product.product_id) {
    await router.push({name: "ProductDetails", params: {productId: product.product_id}});
  }
}

onBeforeMount(async () => {
  let data = await ProductService.pull.fetchProductsByUser();
  if (data) products.value = data;

  let exampleData = await ProductService.pull.fetchExampleProducts();
  if(exampleData) exampleProducts.value = exampleData;
});
</script>
