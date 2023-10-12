<script setup lang="ts">

import {Product, Requirement} from "@/types/catalog.types.ts";

interface Props {
  requirement: Requirement | undefined,
  product: Product,
  loading: boolean
}

const props = defineProps<Props>();

const getProgressColor = (qualification: string) => {
  switch (parseInt(qualification)) {
    case 5:
      return 'green';
    case 4:
      return 'light-green';
    case 3:
      return 'yellow';
    case 2:
      return 'orange';
    case 1:
      return 'red';
    default:
      return 'grey'; // default color in case of any unforeseen values
  }
};

</script>

<template>
  <v-card class="ma-2 pa-2" max-height="200" max-width="500">
    <v-skeleton-loader v-if="loading" type="heading, list-item-two-line"></v-skeleton-loader>
    <v-container v-if="!loading" :fluid="false">
      <v-row no-gutters>
        <v-col cols="8" class="d-flex align-center">
          {{ product.product_name }}
        </v-col>
        <v-col cols="4" class="d-flex align-center justify-end">
          <v-progress-circular
              v-if="requirement?.products[product.product_name]?.qualification"
              :size="50"
              :width="7"
              :color="getProgressColor(requirement?.products[product.product_name].qualification)"
              :model-value="(parseInt(requirement?.products[product.product_name].qualification) / 5 ) * 100"
          >
            {{ requirement?.products[product.product_name].qualification }}
          </v-progress-circular>
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