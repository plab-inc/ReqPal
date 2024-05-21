<script setup lang="ts">

import {Product, Requirement} from "@/types/catalog.ts";
import ProductDetail from "@/components/catalog/product/ProductDetail.vue"

interface Props {
  requirement: Requirement | undefined,
  products: Product[],
  loading: boolean
}

const props = defineProps<Props>();
</script>

<template>
  <v-expansion-panels>
    <v-expansion-panel v-if="requirement">
      <v-expansion-panel-title>
        Produktdetails zur Anforderung
      </v-expansion-panel-title>
      <v-expansion-panel-text>
        <v-row v-if="requirement">
          <v-col v-for="product in products" :key="product.product_name" cols="12" md="6" lg="4">
            <ProductDetail :requirement="requirement" :loading="loading" :product="product"/>
          </v-col>
        </v-row>
      </v-expansion-panel-text>
    </v-expansion-panel>
  </v-expansion-panels>
</template>