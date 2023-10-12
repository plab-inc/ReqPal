<script setup lang="ts">
import {Product} from "@/types/catalog.types.ts";

interface Props {
  products: Product[];
}

const props = defineProps<Props>();
const emit = defineEmits(['onSelectProduct'])

function onSelectProduct(product: String) {
  emit('onSelectProduct', product)
}
</script>

<template>
  <v-item-group mandatory>
    <v-container>
      <v-row>
        <v-col
            :md="2" class="text-h5 d-flex justify-start align-center">
          Choose details for product:
        </v-col>
        <v-col
            v-for="product in products"
            :key="product.product_id"
            :md="2"
        >
          <v-item v-slot="{ isSelected, toggle }">
            <v-card
                :color="isSelected ? 'primary' : ''"
                class="d-flex align-center"
                dark
                height="75"
                @click="() => { if (toggle) { toggle(); } onSelectProduct(product.product_name); }"
            >
              <v-scroll-y-transition>
                <div
                    class="text-h5 flex-grow-1 text-center"
                >
                  {{ product.product_name }}
                </div>
              </v-scroll-y-transition>
            </v-card>
          </v-item>
        </v-col>
      </v-row>
    </v-container>
  </v-item-group>
</template>

<style scoped>

</style>