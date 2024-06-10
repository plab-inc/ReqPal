<template>
  <v-hover>
    <template v-slot:default="{ isHovering, props }">
      <v-card
          v-bind="props"
          :elevation="isHovering ? 12 : 6"
          :color="isHovering ? 'info' : undefined"
          variant="outlined"
          class="ma-2 fill-height"
          min-height="150"
          @click="openProductPage(product.product_url)">
        <v-card-title>
          {{ product.product_name }}
        </v-card-title>
        <v-card-text>
          {{ product.product_url }}
        </v-card-text>
      </v-card>
    </template>
  </v-hover>
</template>

<script setup lang="ts">
import {Product} from "@/types/catalog.ts";

interface Props {
  product: Product,
}

const props = defineProps<Props>();

function openProductPage(url: string) {
  window.open(url, "_blank");
}
</script>