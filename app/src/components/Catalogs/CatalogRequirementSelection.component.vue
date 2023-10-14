<script setup lang="ts">

import {Requirement} from "@/types/catalog.types.ts";
import {useCatalogStore} from "@/stores/catalog.store.ts";
import CatalogSelect from "@/components/Catalogs/CatalogSelect.component.vue";
import RequirementSelect from "@/components/Catalogs/Requirement/RequirementSelect.component.vue";
import RequirementItem from "@/components/Catalogs/Requirement/RequirementItem.component.vue";

const selectedCatalogId = ref<number>();
const selectedRequirement = ref<Requirement>();
const requirements = ref<Requirement[]>([]);
const catalogStore = useCatalogStore();
const loadingReqs = ref<boolean>(false);

async function onCatalogChange() {
  if (selectedCatalogId.value) {
    toggleLoadingReqs();
    await catalogStore.getCatalogWithProductsById(selectedCatalogId.value);
    if (catalogStore.currentCatalog) {
      requirements.value = catalogStore.currentCatalog.requirements;
    }
    toggleLoadingReqs();
  }
}

function toggleLoadingReqs() {
  loadingReqs.value = !loadingReqs.value;
}

watch(selectedCatalogId, (newCatalogId, oldCatalogId) => {
  if (newCatalogId !== oldCatalogId) {
    onCatalogChange();
  }
});

</script>

<template>
  <CatalogSelect v-model="selectedCatalogId"></CatalogSelect>
  <RequirementSelect v-model="selectedRequirement" :loading="loadingReqs" :items="requirements"></RequirementSelect>
  <RequirementItem v-if="selectedRequirement" :requirement="selectedRequirement"></RequirementItem>
</template>

<style scoped>

</style>