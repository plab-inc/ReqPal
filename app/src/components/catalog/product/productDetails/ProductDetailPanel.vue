<script setup lang="ts">

import {Product, Requirement} from "@/types/catalog.ts";
import ProductDetail from "@/components/catalog/product/productDetails/ProductDetail.vue"
import AlertService from "@/services/util/alert.ts";
import {onBeforeMount, ref} from "vue";
import {useCatalogStore} from "@/stores/catalog.ts";

interface Props {
  requirement: Requirement | undefined,
  products: Product[]
}

const loading = ref<boolean>(false);
const props = defineProps<Props>();

const catalogStore = useCatalogStore();

async function getProductDetails() {

  try {
    if (props.requirement) {
      await catalogStore.getProductDetailsForRequirement(props.requirement, props.products);
    }
  } catch (error: any) {
    AlertService.addErrorAlert("Fehler beim Abrufen der Produktdetails: " + error.message);
  }

}
onBeforeMount(async () => {
  loading.value = true;
  await getProductDetails();
  loading.value = false;
})
</script>

<template>
  <v-card :loading="loading" variant="flat" class="pb-5 mt-2">
    <v-row v-if="requirement">
      <v-col v-for="product in products" :key="product.product_name" cols="12" md="6" lg="4">
        <ProductDetail :requirement="requirement" :loading="loading" :product="product"/>
      </v-col>
    </v-row>
  </v-card>
</template>