<script setup lang="ts">

import {Requirement} from "@/types/catalog.types.ts";
import {useCatalogStore} from "@/stores/catalog.store.ts";
import CatalogSelect from "@/components/Catalogs/CatalogSelect.component.vue";
import RequirementSelect from "@/components/Catalogs/Requirement/RequirementSelect.component.vue";

const catalogId = ref<number>();
const requirementId = ref<Requirement>();
const requirements = ref<Requirement[]>([]);
const catalogStore = useCatalogStore();
const loadingReqs = ref<boolean>(false);

async function onCatalogChange() {
  if (catalogId.value) {
    toggleLoadingReqs();
    await catalogStore.getCatalogWithProductsById(catalogId.value);
    if (catalogStore.currentCatalog) {
      requirements.value = catalogStore.currentCatalog.requirements;
    }
    toggleLoadingReqs();
  }
}

function toggleLoadingReqs() {
  loadingReqs.value = !loadingReqs.value;
}

watch(catalogId, (newCatalogId, oldCatalogId) => {
  if (newCatalogId !== oldCatalogId) {
    onCatalogChange();
  }
});

</script>

<template>
  <CatalogSelect v-model="catalogId"></CatalogSelect>
  <RequirementSelect v-model="requirementId" :loading="loadingReqs" :items="requirements"></RequirementSelect>
</template>

<style scoped>

</style>