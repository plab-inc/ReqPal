<script setup lang="ts">

import {Product, Requirement} from "@/types/catalog.types.ts";
import {useCatalogStore} from "@/stores/catalog.store.ts";
import CatalogSelect from "@/components/catalog/CatalogSelect.component.vue";
import RequirementSelect from "@/components/catalog/requirement/RequirementSelect.component.vue";
import RequirementItem from "@/components/catalog/requirement/RequirementItem.component.vue";
import {useLessonFormStore} from "@/stores/lessonForm.store.ts";
import ProductDetailItem from "@/components/catalog/product/ProductDetailItem.component.vue";
import {containsAtLeastOneElementRule, requiredStringRule} from "@/utils/validationRules.ts";
import Help from "@/components/lesson/lessonBuilder/Help.component.vue";

const lessonFormStore = useLessonFormStore()
const catalogStore = useCatalogStore();

const props = defineProps<{ componentId: string }>();
const loadingReqs = ref<boolean>(false);
const requirements = ref<Requirement[]>([]);
const products = ref<Product[]>([]);

const fields = ref<any>({
  question: lessonFormStore.getComponentFieldValues(props.componentId, 'question'),
  solution: lessonFormStore.getComponentFieldValues(props.componentId, 'solution') || {toleranceValue: 0},
  options: lessonFormStore.getComponentFieldValues(props.componentId, 'options') || {
    catalogId: undefined,
    requirementId: undefined,
    askForQualification: false,
    productIds: []
  }
});

const selectedRequirement = ref<Requirement | undefined>();

function updateStoreData() {
  lessonFormStore.setComponentData(props.componentId, 'options', fields.value.options);
  lessonFormStore.setComponentData(props.componentId, 'question', fields.value.question);
  lessonFormStore.setComponentData(props.componentId, 'solution', fields.value.solution);
}

function toggleLoadingReqs() {
  loadingReqs.value = !loadingReqs.value;
}

watch(selectedRequirement, async (value) => {
  if (value) {
    toggleLoadingReqs();
    await catalogStore.getProductDetailsForRequirement(<Requirement>value, products.value).then(() => {
      toggleLoadingReqs();
    });
    fields.value.options.requirementId = value.requirement_id;
  }
}, {deep: false});


watch(fields, async (value) => {

  if (catalogStore.currentCatalog?.catalog_id !== value.options.catalogId) {
    selectedRequirement.value = undefined;
  }

  if (value.options.catalogId) {
    await catalogStore.getCatalogWithProductsById(value.options.catalogId);
  }

  if (catalogStore.currentCatalog) {
    requirements.value = catalogStore.currentCatalog.requirements;
    products.value = catalogStore.currentCatalog.products;
  }

  if (!selectedRequirement.value?.requirement_id && value.options.requirementId) {
    selectedRequirement.value = requirements.value.find(req => req.requirement_id === value.options.requirementId);
  }
  updateStoreData();

}, {deep: true, immediate: true});
</script>

<template>
  <v-container>
    <v-row>
      <v-col>
        <CatalogSelect v-model="fields.options.catalogId"></CatalogSelect>
        <RequirementSelect v-model="selectedRequirement" :loading="loadingReqs"
                           :items="requirements"></RequirementSelect>
      </v-col>
    </v-row>
    <v-row v-if="selectedRequirement">
      <v-col cols="10">
        <RequirementItem v-if="selectedRequirement" :requirement="selectedRequirement" class="mb-5"/>
      </v-col>
      <v-col cols="2" align-self="center">
        <v-switch color="primary" label="Bewertungen abfragen" inset
                  v-model="fields.options.askForQualification"></v-switch>
      </v-col>
    </v-row>

    <v-row v-if="selectedRequirement && fields.options.askForQualification">
      <v-col>
        <div v-if="fields.options.productIds.length <= 0" class="text-subtitle-1 text-warning">Mindestens ein Produkt
          muss ausgewählt werden.
        </div>
      </v-col>
      <v-col v-for="(product) in products" :key="product.product_name" cols="12" md="6" lg="4">
        <ProductDetailItem :requirement="selectedRequirement" :loading="loadingReqs"
                           :product="product"></ProductDetailItem>
        <div class="d-flex justify-center align-center">
          <div>
            <v-switch
                v-model="fields.options.productIds"
                color="primary"
                label="Produkt abfragen"
                :value="product.product_id"
                hide-details
                :rules="[containsAtLeastOneElementRule]"
            ></v-switch>
          </div>
        </div>
      </v-col>
    </v-row>
    <v-row v-if="selectedRequirement && fields.options.askForQualification">
      <v-col>
        <v-text-field
            label="Beschreibung der Aufgabe"
            :rules="[requiredStringRule]"
            v-model="fields.question"
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
            v-model="fields.solution.toleranceValue"
        >
        </v-slider>
      </v-col>
    </v-row>
    <v-row no-gutters>
      <v-col class="d-flex flex-grow-1 align-end justify-end">
        <Help dialog-type="productQualificationTeacherExplanation"></Help>
      </v-col>
    </v-row>
  </v-container>
</template>
<style scoped>

</style>