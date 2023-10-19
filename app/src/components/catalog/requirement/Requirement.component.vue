<script setup lang="ts">
import {useCatalogStore} from "@/stores/catalog.store.ts";
import {Requirement} from "@/types/catalog.types.ts";
import {ref} from "vue";
import {useLessonFormStore} from "@/stores/lessonForm.store.ts";

const requirement = ref<Requirement>();
const loading = ref<boolean>(false);

interface Props {
  componentId: string,
}

const props = defineProps<Props>();
const lessonFormStore = useLessonFormStore();
const fields = ref<any>({
  options: lessonFormStore.getComponentFieldValues(props.componentId, 'options'),
});

onBeforeMount(async () => {
  loading.value = true;
  if (fields.value.options) {
    if (fields.value.options.catalogId && fields.value.options.requirementId) {
      const catalogStore = useCatalogStore();
      await catalogStore.getCatalogWithProductsById(fields.value.options.catalogId);
      const reqs = catalogStore.currentCatalog?.requirements;
      if (reqs) {
        requirement.value = reqs.find(r => r.requirement_id === fields.value.options.requirementId);
      }
    }
  }
  loading.value = false;
})
</script>

<template>
  <v-card :loading="loading" :title="requirement?.title ? requirement?.title : 'Der Katalog zu dieser Komponente ist nicht mehr verfügbar'"
          :text="requirement?.description ? requirement?.description : ''"
          variant="outlined">
  </v-card>
</template>

<style scoped>

</style>