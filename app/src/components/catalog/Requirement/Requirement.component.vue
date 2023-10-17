<script setup lang="ts">
import {useCatalogStore} from "@/stores/catalog.store.ts";
import {Requirement} from "@/types/catalog.types.ts";

type Option = {
  catalogId: number,
  requirementId: number
}

const requirement = ref<Requirement>();
const loading = ref<boolean>(false);

interface Props {
  componentId: number,
  question: any,
  options: Option | any,
}

const props = defineProps<Props>();

onBeforeMount(async () => {
  loading.value = true;
  if (props.options) {
    if (props.options.catalogId && props.options.requirementId) {
      const catalogStore = useCatalogStore();
      await catalogStore.getCatalogWithProductsById(props.options.catalogId);
      const reqs = catalogStore.currentCatalog?.requirements;
      if (reqs) {
        requirement.value = reqs.find(r => r.requirement_id === props.options.requirementId);
      }
    }
  }
  loading.value = false;
})
</script>

<template>
  <v-card :loading="loading" :title="requirement?.title ? requirement?.title : 'Anforderung'"
          :text="requirement?.description ? requirement?.description : ''"
          variant="outlined">
  </v-card>
</template>

<style scoped>

</style>