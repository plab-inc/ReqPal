<script setup lang="ts">
import {onBeforeMount, ref} from "vue";
import {useProductStore} from "@/stores/product.ts";
import {Product} from "@/types/catalog.ts";

const productStore = useProductStore();
const product = ref<Product>();

onBeforeMount(async () => {
  if (productStore.currentProduct)
    product.value = productStore.currentProduct;
});

</script>

<template>
  <p>{{ product }}</p>
</template>