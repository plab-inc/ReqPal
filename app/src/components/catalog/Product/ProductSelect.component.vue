<script setup lang="ts">
import {Product} from "@/types/catalog.types.ts";

interface Props {
  products: Product[];
  textLabel: string
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
            :md="2" class="text-h5">
          {{ textLabel }}
        </v-col>
        <v-col
            v-for="product in products"
            :key="product.product_id"
            :md="2"
        >
          <v-item v-slot="{ isSelected, toggle }">
            <v-card
                :color="isSelected ? 'primary' : ''"
                dark
                @click="() => { if (toggle) { toggle(); } onSelectProduct(product.product_name); }"
            >
              <v-scroll-y-transition>
                <v-card-text class="text-center"
                >
                  {{ product.product_name }}
                </v-card-text>
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