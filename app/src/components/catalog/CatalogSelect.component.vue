<script setup lang="ts">
import {useCatalogStore} from "@/stores/catalog.store.ts";
import {dbCatalog} from "@/types/catalog.types.ts";

interface Props {
  modelValue: number | undefined
}

const props = defineProps<Props>();
const catalogs = ref<dbCatalog[]>([]);
const loading = ref<boolean>();
const emit = defineEmits(['update:modelValue']);

const selectedCatalog = computed({
  get() {
    return props.modelValue;
  },
  set(newValue) {
    emit('update:modelValue', newValue);
  }
})

onBeforeMount(async () => {
  loading.value = true;
  const catalogStore = useCatalogStore();
  await catalogStore.getAllCatalogs();
  catalogs.value = catalogStore.allCatalogs;
  if (props.modelValue) {
    selectedCatalog.value = props.modelValue;
  }
  loading.value = false;
})
</script>

<template>
  <v-select
      label="Katalog wählen"
      v-model="selectedCatalog"
      :items="catalogs"
      :item-title="item => item.catalog_name"
      :item-value="item => item.catalog_id"
      :loading="loading"
  ></v-select>
</template>

<style scoped>

</style>