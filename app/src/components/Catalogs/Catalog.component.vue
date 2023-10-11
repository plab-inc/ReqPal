<script setup lang="ts">
import {useCatalogStore} from "@/stores/catalog.store.ts";
import {Catalog, Requirement} from "@/types/catalog.types.ts";
import AlertService from "@/services/alert.service.ts";
import {Lesson} from "@/types/lesson.types.ts";
import router from "@/router";
import {checkBoxMinimumRule, requiredRule} from "@/utils/validationRules.ts";
import {useLessonStore} from "@/stores/lesson.store.ts";

const catalog = ref<Catalog>();
const catalogStore = useCatalogStore();
let catalogIdAsNumber: number = 0;

const lessonStore = useLessonStore();

const loading = ref<boolean>(true);
const loadingBar = ref<boolean>(false);

const requirementItems = ref<Requirement[]>([]);

const selectAll = ref<boolean>(false);

const showAllLessons = ref<boolean>(false);
const allLessons = ref<Lesson[]>();
const catalogLessons = ref<Lesson[]>();

const showNewReqsForLesson = ref<boolean>(false);

const selectedLesson = ref<Lesson | null>();
const selectedRequirement = ref<Requirement>();
const reqGroupSelection = ref<number[]>([]);

const isFormValid = ref(false);
const rules = {
  required: requiredRule,
  minimumCheckbox: checkBoxMinimumRule,
};

const headersForLesson = [
  {text: 'Selection', value: 'select'},
  {text: 'ID', value: 'requirement_id', sortable: true},
  {text: 'Requirement', value: 'reqId', sortable: true},
  {text: 'Titel', value: 'title', sortable: true},
  {text: 'Beschreibung', value: 'description', sortable: true},
]

const headers = [
  {text: 'ID', value: 'requirement_id', sortable: true},
  {text: 'Requirement', value: 'reqId', sortable: true},
  {text: 'Titel', value: 'title', sortable: true},
  {text: 'Beschreibung', value: 'description', sortable: true},
]

function onSubmit() {
  if (isFormValid) {
    if (showNewReqsForLesson.value) {
      addRequirements();
    } else {
      removeRequirements();
    }
  }
}

async function onLessonChanged() {
  loadingBar.value = true;
  if (selectedLesson.value) {
    await catalogStore.getRequirementsForLesson(selectedLesson.value?.id)
    const loadedReqs = catalogStore.currentLessonRequirements;

    if (loadedReqs) {
      reqGroupSelection.value = [];
      loadedReqs.forEach(req => {
        reqGroupSelection.value.push(req.requirement_id);
      })
      requirementItems.value = loadedReqs;
      selectAll.value = true;
    }
  }
  loadingBar.value = false;
}

watch(selectedLesson, (newLesson, oldLesson) => {
  if (newLesson && oldLesson !== newLesson) {
    onLessonChanged();
  }
});

function toggleAllLessons() {
  showAllLessons.value = !showAllLessons.value;
}

async function onRowClick(item: Requirement) {
  selectedRequirement.value = item;
  await getProductDetails();
}

async function getProductDetails() {
  loadingBar.value = true;
  try {
    if (selectedRequirement.value) {
      await catalogStore.getProductDetailsForRequirement(selectedRequirement.value);
    }
  } catch (error: any) {
    AlertService.addErrorAlert("Failed to get product details: " + error.message);
  }
  loadingBar.value = false;
}

function onReset() {
  selectedLesson.value = null;
  selectAll.value = false;
  reqGroupSelection.value = [];
  setUpCatalog();
}

function toggleNewRequirements() {
  loadingBar.value = true;
  reqGroupSelection.value = [];
  selectAll.value = false;
  showNewReqsForLesson.value = !showNewReqsForLesson.value;
  let allReqs: Requirement[] = [];
  if (catalog.value) {
    allReqs = catalog.value.requirements;
  }

  if (requirementItems.value.length <= 0) {
    requirementItems.value = allReqs;
  } else {
    let newReqs: Requirement[] = allReqs.filter((req) => {
      return !requirementItems.value.some((item) => item.requirement_id === req.requirement_id);
    });
    requirementItems.value = [];
    requirementItems.value.push(...newReqs);
  }
  loadingBar.value = false;
}

function toggleSelection() {
  selectAll.value = !selectAll.value;
  if (selectAll.value) {
    reqGroupSelection.value = [];
    requirementItems.value.forEach(item => {
      reqGroupSelection.value.push(item.requirement_id);
    })
  } else {
    reqGroupSelection.value = [];
  }
}

async function removeRequirements() {
  loadingBar.value = true;
  if (isFormValid && reqGroupSelection.value.length > 0 && selectedLesson.value) {
    try {
      await catalogStore.removeRequirementsFromLesson(selectedLesson.value.id, reqGroupSelection.value);
      AlertService.addSuccessAlert("Requirements removed from " + selectedLesson.value?.id + " " + selectedLesson.value?.title);
      await router.push({name: "Catalogs"})
    } catch (error: any) {
      AlertService.addErrorAlert("Failed to remove catalog and requirements: " + error.message);
    }
  }
  loadingBar.value = false;
}

async function addRequirements() {
  loadingBar.value = true;
  if (reqGroupSelection.value.length > 0 && selectedLesson.value) {
    try {
      await catalogStore.setCatalogAndRequirementsToLesson(selectedLesson.value.id, reqGroupSelection.value);
      AlertService.addSuccessAlert("Requirements added to " + selectedLesson.value?.id + " " + selectedLesson.value?.title);
      await router.push({name: "Catalogs"})
    } catch (error: any) {
      AlertService.addErrorAlert("Failed to add catalog and requirements: " + error.message);
    }
  } else {
    AlertService.addWarningAlert("Es fehlen Daten.");
  }
  loadingBar.value = false;
}

onBeforeMount(async () => {

  const route = useRoute();
  const catalogId = route.params.catalogId as string;
  catalogIdAsNumber = parseInt(catalogId, 10);

  await catalogStore.getCatalogWithProductsById(catalogIdAsNumber);
  setUpCatalog();

  await lessonStore.fetchLessons();
  if (lessonStore.lessons) {
    allLessons.value = lessonStore.lessons;
  }

  if (catalog.value) {
    await catalogStore.getAllLessonsForCatalog(catalogIdAsNumber)
    if (catalogStore.currentCatalogLessons.length > 0) {
      catalogLessons.value = catalogStore.currentCatalogLessons;
    } else {
      catalogLessons.value = [];
      AlertService.addInfoAlert("Zu diesem Katalog gehören noch keine Lektionen.");
    }
  }

})

function setUpCatalog() {
  if (catalogStore.currentCatalog) {
    catalog.value = catalogStore.currentCatalog;
    if (catalog.value?.requirements) {
      requirementItems.value = catalog.value.requirements;
    }
  } else {
    AlertService.addWarningAlert("Kein Katalog gefunden mit der id: " + catalogIdAsNumber);
  }
  loading.value = false;
}
</script>

<template>
  <v-progress-linear v-if="loadingBar" indeterminate></v-progress-linear>

  <h1 class="my-md-8 my-4 text-center text-md-left">{{ catalog?.catalog_name }}</h1>

  <div>
    <v-row>
      <v-col md="6">
        <h4 class="text-center text-md-left">Selected Requirement</h4>
        <div class="d-flex align-center my-2">
          <v-card :title="selectedRequirement?.title ? selectedRequirement?.title : 'Requirement'"
                  :text="selectedRequirement?.description ? selectedRequirement?.description : 'Wähle eine Anforderung'"
                  variant="outlined">
          </v-card>
        </div>
      </v-col>
      <v-col md="6">
        <h4 class="text-center text-md-right">Produkte und Produkt Details</h4>
        <div v-for="product in catalog?.products"
             class="d-flex justify-center justify-md-end align-center my-2">
          <v-card class="flex-grow-1 flex-md-grow-0" min-width="400" min-height="120">
            <v-card-item>
              <v-card-title>{{ product.product_name }}</v-card-title>
            </v-card-item>
            <v-card-text>
              <div v-if="selectedRequirement?.products[product.product_name]">
                <p> {{ selectedRequirement?.products[product.product_name].qualification }}</p>
                <p> {{ selectedRequirement?.products[product.product_name].comment }}</p>
              </div>
            </v-card-text>
          </v-card>
        </div>
      </v-col>
    </v-row>
  </div>

  <v-form v-model="isFormValid" validate-on="lazy blur" @submit.prevent="onSubmit">

    <div class="d-flex justify-center flex-column flex-md-row justify-md-start">
      <v-btn type="button" @click="onReset" class="my-2 pa-2">Whole Catalog</v-btn>
      <v-btn type="button" @click="toggleAllLessons" class="my-2 pa-2 ml-md-4">
        {{ showAllLessons ? 'Lektionen zum Katalog' : 'Alle Lektionen' }}
      </v-btn>
      <v-btn type="button" v-if="selectedLesson" @click="toggleNewRequirements" class="my-2 pa-2 ml-md-4">
        {{ showNewReqsForLesson ? 'Current Requirements' : 'New Requirements' }}
      </v-btn>
    </div>

    <div class="d-flex flex-column-reverse flex-md-row">
      <v-select
          v-model="selectedLesson"
          :items="showAllLessons ? allLessons : catalogLessons"
          label="Lesson"
          :item-title="item => item.title"
          :item-value="item => item"
          required
      ></v-select>
      <v-btn type="submit" v-if="selectedLesson && !showNewReqsForLesson"
             class="my-2 pa-2 ml-md-4">
        Remove from Lesson
      </v-btn>
      <v-btn type="submit" v-if="selectedLesson && showNewReqsForLesson"
             class="my-2 pa-2 ml-md-4">
        Add to Lesson
      </v-btn>
    </div>

    <EasyDataTable
        :headers="selectedLesson ? headersForLesson : headers"
        :items="requirementItems"
        :loading="loading"
        :rows-items="[5, 10, 15, 25, 50]"
        :rows-per-page="10"
        table-class-name="customize-table"
        @click-row="onRowClick">

      <template #header-select="header">
        <div>
          <div class="d-flex flex-column justify-center align-center">
            <p>{{ selectAll ? 'Deselect All' : 'Select All' }}</p>
            <v-checkbox color="rgb(var(--v-theme-secondary))" v-model="selectAll" @click="toggleSelection"
            ></v-checkbox>
          </div>
        </div>
      </template>

      <template #item-select="item">
        <div class="d-flex flex-column justify-center align-center">
          <v-checkbox color="rgb(var(--v-theme-primary))" v-model="reqGroupSelection" :value="item.requirement_id"
                      label="" :rules="[checkBoxMinimumRule]"></v-checkbox>
        </div>
      </template>
    </EasyDataTable>
  </v-form>
</template>

<style scoped>

.customize-table {
  --easy-table-border: 1px solid rgb(var(--v-theme-primary));
  --easy-table-row-border: 1px solid rgb(var(--v-theme-primary));

  --easy-table-header-font-size: 14px;
  --easy-table-header-height: 50px;
  --easy-table-header-font-color: white;
  --easy-table-header-background-color: rgb(var(--v-theme-primary));

  --easy-table-header-item-padding: 10px 15px;

  --easy-table-body-even-row-font-color: #fff;
  --easy-table-body-even-row-background-color: #4c5d7a;

  --easy-table-body-row-font-color: rgb(var(--v-theme-textColor));
  --easy-table-body-row-background-color: rgb(var(--v-theme-background));
  --easy-table-body-row-height: 50px;
  --easy-table-body-row-font-size: 14px;

  --easy-table-body-row-hover-font-color: #2d3a4f;
  --easy-table-body-row-hover-background-color: rgb(var(--v-theme-highlightColor));

  --easy-table-body-item-padding: 10px 15px;

  --easy-table-footer-background-color: rgb(var(--v-theme-primary));
  --easy-table-footer-font-color: white;
  --easy-table-footer-font-size: 14px;
  --easy-table-footer-padding: 0px 10px;
  --easy-table-footer-height: 50px;

  --easy-table-rows-per-page-selector-width: 70px;
  --easy-table-rows-per-page-selector-option-padding: 10px;
  --easy-table-rows-per-page-selector-z-index: 1;

  --easy-table-scrollbar-track-color: #2d3a4f;
  --easy-table-scrollbar-color: #2d3a4f;
  --easy-table-scrollbar-thumb-color: #4c5d7a;;
  --easy-table-scrollbar-corner-color: #2d3a4f;

  --easy-table-loading-mask-background-color: rgb(var(--v-theme-surface));
}
</style>