<script setup lang="ts">

import {CatalogDTO, Product, Requirement} from "@/types/catalog.ts";
import {useCatalogStore} from "@/stores/catalog.ts";
import RequirementItem from "@/components/catalog/requirement/Requirement.vue";
import {useLessonFormStore} from "@/stores/lessonForm.ts";
import ProductDetail from "@/components/catalog/product/ProductDetail.vue";
import {containsAtLeastOneElementRule, requiredRule, requiredStringRule} from "@/utils/validationRules.ts";
import Help from "@/components/lesson/builder/helper/Help.vue";
import Delete from "@/components/lesson/builder/helper/Delete.vue";
import PointsInput from "@/components/lesson/builder/helper/PointsInput.vue";
import {onBeforeMount, ref, watch} from "vue";
import {convertStringToNumber} from "@/utils/helper.ts";

const lessonFormStore = useLessonFormStore()
const catalogStore = useCatalogStore();

const props = defineProps<{ componentId: string }>();
const loadingReqs = ref<boolean>(false);
const loadingCatalogs = ref<boolean>(false);
const requirements = ref<Requirement[]>([]);
const catalogs = ref<CatalogDTO[]>([]);
const products = ref<Product[]>([]);

const fields = ref<any>({
  question: lessonFormStore.getLessonModuleFieldValues(props.componentId, 'question'),
  solution: lessonFormStore.getLessonModuleFieldValues(props.componentId, 'solution') || {
    type: "Requirement",
    toleranceValue: 0
  },
  options: lessonFormStore.getLessonModuleFieldValues(props.componentId, 'options') || {
    type: "Requirement",
    catalogId: undefined,
    requirementId: undefined,
    askForQualification: false,
    productIds: []
  }
});

const selectedRequirement = ref<Requirement | undefined>();

function updateStoreData() {
  lessonFormStore.setLessonModuleData(props.componentId, 'options', fields.value.options);
  lessonFormStore.setLessonModuleData(props.componentId, 'question', fields.value.question);
  lessonFormStore.setLessonModuleData(props.componentId, 'solution', fields.value.solution);
}

function toggleLoadingReqs() {
  loadingReqs.value = !loadingReqs.value;
}

onBeforeMount(async () => {
  loadingCatalogs.value = true;
  const catalogStore = useCatalogStore();
  await catalogStore.fetchCatalogs();
  catalogs.value = catalogStore.getCustomCatalogs.concat(catalogStore.getExampleCatalogs);
  loadingCatalogs.value = false;
})

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

  if (fields.value.solution.toleranceValue) {
    fields.value.solution.toleranceValue = convertStringToNumber(fields.value.solution.toleranceValue)
  }

  if (value.options.catalogId) {
    await catalogStore.getFullCatalogById(value.options.catalogId);
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
        <v-select
            label="Katalog wählen"
            v-model="fields.options.catalogId"
            :rules="[requiredRule]"
            :items="catalogs"
            :item-title="item => item.catalog_name"
            :item-value="item => item.catalog_id"
            :loading="loadingCatalogs"
        ></v-select>
        <v-select
            label="Anforderung wählen"
            v-model="selectedRequirement"
            :rules="[requiredRule]"
            :items="requirements"
            :item-title="item => item.title"
            :item-value="item => item"
            :loading="loadingReqs"
            :disabled="!fields.options.catalogId"
        ></v-select>
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
      <v-col v-for="(product) in products" :key="product.product_name" md="6" lg="4">
        <v-row>
          <v-col>
            <ProductDetail :requirement="selectedRequirement" :loading="loadingReqs"
                           :product="product"/>
          </v-col>
          <v-col>
            <div class="d-flex justify-center align-center">
              <div>
                <v-switch
                    v-model="fields.options.productIds"
                    inset
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
      </v-col>
    </v-row>
    <v-row v-if="selectedRequirement && fields.options.askForQualification">
      <v-col cols="12">
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
      <v-col cols="2" v-if="fields.options.askForQualification">
        <PointsInput :component-id="props.componentId"></PointsInput>
      </v-col>
      <v-col :cols="fields.options.askForQualification ? 10 : 12" class="d-flex flex-grow-1 align-end justify-end">
        <Help dialog-type="productQualificationTeacherExplanation"/>
        <div class="mx-1"/>
        <Delete :component-id="props.componentId"/>
      </v-col>
    </v-row>
  </v-container>
</template>
<style scoped>

</style>