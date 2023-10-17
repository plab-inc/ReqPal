<script setup lang="ts">

import {Product, Requirement} from "@/types/catalog.types.ts";
import ProductDetailItem from "@/components/catalog/Product/ProductDetailItem.component.vue"

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
            <ProductDetailItem :requirement="requirement" :loading="loading" :product="product"></ProductDetailItem>
          </v-col>
        </v-row>
      </v-expansion-panel-text>
    </v-expansion-panel>
  </v-expansion-panels>
</template>