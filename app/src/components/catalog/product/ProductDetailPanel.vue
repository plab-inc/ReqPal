<script setup lang="ts">

import { Product, Requirement } from "@/types/catalog.ts";
import ProductDetail from "@/components/catalog/product/ProductDetail.vue";
import { ref } from "vue";

interface Props {
  requirement: Requirement | undefined,
  products: Product[]
}

const loading = ref<boolean>(false);
defineProps<Props>();
</script>

<template>
  <v-card :loading="loading" variant="flat" class="pb-5 mt-2">
    <v-row v-if="requirement">
      <v-col v-for="product in products" :key="product.product_name" cols="12" md="6" lg="4">
        <ProductDetail :requirement="requirement" :loading="loading" :product="product"/>
      </v-col>
    </v-row>
  </v-card>
</template>