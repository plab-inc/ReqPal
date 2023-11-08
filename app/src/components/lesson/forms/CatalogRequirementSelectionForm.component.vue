<script setup lang="ts">

import {Product, Requirement} from "@/types/catalog.types.ts";
import {useCatalogStore} from "@/stores/catalog.store.ts";
import CatalogSelect from "@/components/catalog/CatalogSelect.component.vue";
import RequirementSelect from "@/components/catalog/requirement/RequirementSelect.component.vue";
import RequirementItem from "@/components/catalog/requirement/RequirementItem.component.vue";
import {useLessonFormStore} from "@/stores/lessonForm.store.ts";
import ProductDetailItem from "@/components/catalog/product/ProductDetailItem.component.vue";
import {requiredStringRule} from "@/utils/validationRules.ts";

const lessonFormStore = useLessonFormStore()
const catalogStore = useCatalogStore();

const props = defineProps<{ componentId: string }>();
const loadingReqs = ref<boolean>(false);

const selectedCatalogId = ref<number>();
const selectedRequirement = ref<Requirement>();
const askForQualification = ref<boolean>(false);

const requirements = ref<Requirement[]>([]);
const products = ref<Product[]>([]);
const tolerance = ref<number>(0);

const fields = ref<any>({
  options: lessonFormStore.getComponentFieldValues(props.componentId, 'options'),
  solution: lessonFormStore.getComponentFieldValues(props.componentId, 'solution'),
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
      products.value = catalogStore.currentCatalog.products;
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

watch(selectedRequirement, async (newReq, oldReq) => {
  if (oldReq != newReq) {
    fields.value.options.requirementId = newReq?.requirement_id;
    await catalogStore.getProductDetailsForRequirement(<Requirement>newReq, products.value);
    updateStoreData();
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
  <v-container>
  <v-row>
    <v-col>
      <CatalogSelect v-model="selectedCatalogId"></CatalogSelect>
      <RequirementSelect v-model="selectedRequirement" :loading="loadingReqs"
                         :items="requirements"></RequirementSelect>
    </v-col>
  </v-row>
    <v-row v-if="selectedRequirement">
      <v-col cols="10">
        <RequirementItem v-if="selectedRequirement" :requirement="selectedRequirement" class="mb-5"/>
      </v-col>
      <v-col cols="2" align-self="center">
        <v-switch color="primary" label="Bewerungen Abfragen" inset v-model="askForQualification"></v-switch>
      </v-col>
    </v-row>
    <v-row v-if="selectedRequirement && askForQualification">
      <v-col v-for="product in products" :key="product.product_name" cols="12" md="6" lg="4">
        <ProductDetailItem :requirement="selectedRequirement" :loading="loadingReqs" :product="product"></ProductDetailItem>
      </v-col>
    </v-row>
    <v-row v-if="selectedRequirement && askForQualification">
      <v-col>
        <v-text-field
            label="Beschreibung der Aufgabe"
            :rules="[requiredStringRule]"
        ></v-text-field>
      </v-col>
      <v-col>
        <v-slider
            min="0"
            max="4"
            step="1"
            thumb-label
            label="Toleranz"
            tick-size="5"
            show-ticks
            v-model="tolerance"
        >
        </v-slider>
      </v-col>
    </v-row>
  </v-container>
</template>
<style scoped>

</style>