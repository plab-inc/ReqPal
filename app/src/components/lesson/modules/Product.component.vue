<script setup lang="ts">
import ProductItem from "@/components/catalog/Product/ProductItem.component.vue";

interface Props {
  componentId: number,
  question: string | any,
  options: any,
  hint: string | any,
}

const props = defineProps<Props>();

</script>

<template>
  <v-expansion-panels>
    <v-expansion-panel>
      <v-expansion-panel-title>
        Produkte
      </v-expansion-panel-title>
      <v-expansion-panel-text>
        <v-row>
          <v-col v-for="product in options" :key="product.product_name" cols="12" md="6" lg="4">
            <ProductItem :options="product"></ProductItem>
          </v-col>
        </v-row>
      </v-expansion-panel-text>
    </v-expansion-panel>
  </v-expansion-panels>
</template>

<style scoped>

</style>