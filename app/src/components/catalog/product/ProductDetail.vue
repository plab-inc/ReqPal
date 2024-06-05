<script setup lang="ts">

import { Product, Requirement } from "@/types/catalog.ts";
import ProductQualification from "@/components/catalog/product/ProductQualification.vue";

interface Props {
  requirement: Requirement | undefined,
  product: Product,
  loading: boolean
}

const props = defineProps<Props>();

function openProductPage(url: string) {
  window.open(url, "_blank");
}

</script>

<template>
  <v-hover>
    <template v-slot:default="{ isHovering, props }">
      <v-card
        v-bind="props"
        :elevation="isHovering ? 12 : 6"
        :color="isHovering ? 'info' : undefined"
        variant="outlined"
        class="ma-2 fill-height"
        min-height="150" max-width="500"
        @click="openProductPage(product.product_url)">
        <v-skeleton-loader v-if="loading" type="heading, list-item-two-line"></v-skeleton-loader>
        <v-container v-if="!loading">
          <v-row no-gutters justify="start">
            <v-col cols="9" class="text-h6 font-weight-bold" align-self="center">
              <v-card-title>
                {{ product.product_name }}
              </v-card-title>
            </v-col>
            <v-col cols="3" class="d-flex align-center justify-end">
              <ProductQualification :size="70"
                                    :qualification="requirement?.products[product.product_name]?.qualification + ''"></ProductQualification>
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
  </v-hover>
</template>