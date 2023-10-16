<script setup lang="ts">

import {Requirement} from "@/types/catalog.types.ts";
import {useCatalogStore} from "@/stores/catalog.store.ts";
import CatalogSelect from "@/components/catalog/CatalogSelect.component.vue";
import RequirementSelect from "@/components/catalog/Requirement/RequirementSelect.component.vue";
import RequirementItem from "@/components/catalog/Requirement/RequirementItem.component.vue";
import {useLessonFormStore} from "@/stores/lessonForm.store.ts";

const selectedCatalogId = ref<number>();
const selectedRequirement = ref<Requirement>();
const requirements = ref<Requirement[]>([]);
const catalogStore = useCatalogStore();
const loadingReqs = ref<boolean>(false);

const props = defineProps<{ componentId: string }>();
const lessonFormStore = useLessonFormStore();

const fields = ref<any>({
  options: lessonFormStore.getComponentFieldValues(props.componentId, 'options'),
});

init();

async function init() {
  const storedOptions = lessonFormStore.getComponentFieldValues(props.componentId, 'options');
  if (storedOptions) {
    fields.value.options = storedOptions;
    selectedCatalogId.value = fields.value.options.catalogId;
    await onCatalogChange();
    const foundReq = requirements.value.find(r => r.requirement_id === fields.value.options.requirementId);
    if (foundReq) {
      selectedRequirement.value = foundReq;
    }
  } else {
    fields.value.options = {
      catalogId: undefined,
      requirementId: undefined,
    }
  }
  updateStoreData();
}

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

function updateStoreData() {
  lessonFormStore.setComponentData(props.componentId, 'options', fields.value.options);
}

function toggleLoadingReqs() {
  loadingReqs.value = !loadingReqs.value;
}

watch(selectedRequirement, (newReq) => {
  if (newReq) {
    fields.value.options.requirementId = newReq.requirement_id;
  }
}, {deep: true});

watch(selectedCatalogId, (newCat, oldCat) => {
  if (newCat !== oldCat) {
    onCatalogChange();
    fields.value.options.catalogId = newCat;
    updateStoreData();
  }
}, {deep: true});

watch(selectedRequirement, (newReq) => {
  if (newReq) {
    fields.value.options.requirementId = newReq.requirement_id;
    updateStoreData();
  }
}, {deep: true});
</script>

<template>
  <CatalogSelect v-model="selectedCatalogId"></CatalogSelect>
  <RequirementSelect v-model="selectedRequirement" :loading="loadingReqs"
                     :items="requirements"></RequirementSelect>
  <RequirementItem v-if="selectedRequirement" :requirement="selectedRequirement"></RequirementItem>
</template>
<style scoped>

</style>