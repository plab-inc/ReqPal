<script setup lang="ts">

import {Product, Requirement} from "@/types/catalog.types.ts";
import ProductQualification from "@/components/catalog/product/ProductQualification.component.vue";

interface Props {
  requirement: Requirement | undefined,
  product: Product,
  loading: boolean
}

const props = defineProps<Props>();

</script>

<template>
  <v-card class="ma-2 pa-2" max-height="200" max-width="500">
    <v-skeleton-loader v-if="loading" type="heading, list-item-two-line"></v-skeleton-loader>
    <v-container v-if="!loading">
      <v-row no-gutters>
        <v-col cols="8" class="d-flex align-center">
          {{ product.product_name }}
        </v-col>
        <v-col cols="4" class="d-flex align-center justify-end">
          <ProductQualification :size="50"
              :qualification="requirement?.products[product.product_name].qualification + ''"></ProductQualification>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <div v-if="requirement?.products[product.product_name]">
            {{ requirement?.products[product.product_name].comment }}
          </div>
        </v-col>
      </v-row>

    </v-container>
  </v-card>
</template>