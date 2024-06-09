<script setup lang="ts">

import {Product} from "@/types/catalog.ts";
import ProductItem from "@/components/catalog/product/ProductItem.vue";
import {onBeforeMount, ref} from "vue";
import {useCatalogStore} from "@/stores/catalog.ts";

const catalogStore = useCatalogStore();
const products = ref<Product[]>([]);
const page = ref(1);

onBeforeMount(async () => {
  if (catalogStore.getCurrentCatalog) {
    products.value = catalogStore.getCurrentCatalog?.products;
  }
})
</script>

<template>
  <v-expansion-panels>
    <v-expansion-panel title="Produkte">
      <v-expansion-panel-text>

        <div v-if="products.length > 0">
          <v-data-iterator :items="products" :items-per-page="3" :page="page">

            <template v-slot:default="{ items }">
              <v-row>
                <template
                    v-for="(item, i) in items"
                    :key="item.raw.product_id"
                >
                  <v-col cols="4">
                    <ProductItem :product="item.raw"></ProductItem>
                  </v-col>
                </template>
              </v-row>
            </template>

            <template v-slot:footer="{ page, pageCount, prevPage, nextPage }">
              <div class="d-flex align-center justify-center pa-4">
                <v-btn
                    :disabled="page === 1"
                    density="comfortable"
                    icon="mdi-arrow-left"
                    variant="tonal"
                    rounded
                    @click="prevPage"
                ></v-btn>

                <div class="mx-2 text-caption">
                  Page {{ page }} of {{ pageCount }}
                </div>

                <v-btn
                    :disabled="page >= pageCount"
                    density="comfortable"
                    icon="mdi-arrow-right"
                    variant="tonal"
                    rounded
                    @click="nextPage"
                ></v-btn>
              </div>
            </template>
          </v-data-iterator>
        </div>

        <v-row v-if="products.length <= 0">
          <v-col>
            <p>Diesem Katalog wurden noch keine Produkte zugeordnet!</p>
          </v-col>
        </v-row>

      </v-expansion-panel-text>
    </v-expansion-panel>
  </v-expansion-panels>
</template>