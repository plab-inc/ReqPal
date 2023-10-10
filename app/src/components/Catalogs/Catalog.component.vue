<script setup lang="ts">
import {useCatalogStore} from "@/stores/catalog.store.ts";
import {Catalog, Requirement} from "@/types/catalog.types.ts";
import AlertService from "@/services/alert.service.ts";
import {Lesson} from "@/types/lesson.types.ts";
import router from "@/router";
import ProductChoice from "@/components/Catalogs/ProductChoice.component.vue"
import {checkBoxMinimumRule, requiredRule} from "@/utils/validationRules.ts";

const catalog = ref<Catalog>();
const catalogStore = useCatalogStore();
let catalogIdAsNumber: number = 0;

const loading = ref<boolean>(true);
const loadingBar = ref<boolean>(false);
const items = ref<Requirement[]>([]);
const themeColor = "#6e4aff";
const selectAll = ref<boolean>(false);
const selectedProduct = ref();
const lessons = ref<Lesson[]>();
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
  {text: 'Qualifizierung', value: 'productQualification', sortable: true},
  {text: 'Kommentar', value: 'productComment', sortable: true},
]

const headers = [
  {text: 'ID', value: 'requirement_id', sortable: true},
  {text: 'Requirement', value: 'reqId', sortable: true},
  {text: 'Titel', value: 'title', sortable: true},
  {text: 'Beschreibung', value: 'description', sortable: true},
  {text: 'Qualifizierung', value: 'productQualification', sortable: true},
  {text: 'Kommentar', value: 'productComment', sortable: true},
]

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
      items.value = loadedReqs;
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

function onRowClick(item: Requirement) {
  if (item) {
    selectedRequirement.value = item;
  }
}

function onSelectProduct(name: string) {
  selectedProduct.value = name;
}

function onReset() {
  selectedLesson.value = null;
  selectAll.value = false;
  reqGroupSelection.value = [];
  setUpCatalog();
}

function toggleSelection() {
  selectAll.value = !selectAll.value;
  if (selectAll.value) {
    reqGroupSelection.value = [];
    items.value.forEach(item => {
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

  await catalogStore.getWholeCatalogById(catalogIdAsNumber);
  setUpCatalog();

  if (catalog.value) {
    await catalogStore.getAllLessonsForCatalog(catalogIdAsNumber)
    if (catalogStore.currentCatalogLessons.length > 0) {
      lessons.value = catalogStore.currentCatalogLessons;
    } else {
      lessons.value = [];
      AlertService.addInfoAlert("Zu diesem Katalog gehören noch keine Lektionen.");
    }
  }

})

function setUpCatalog() {
  if (catalogStore.currentCatalog) {
    catalog.value = catalogStore.currentCatalog;
    if (catalog.value?.requirements) {
      items.value = catalog.value.requirements;
    }
    if (catalog.value?.products && catalog.value?.products[0]) {
      selectedProduct.value = catalog.value?.products[0];
    }
  } else {
    AlertService.addWarningAlert("Kein Katalog gefunden mit der id: " + catalogIdAsNumber);
  }
  loading.value = false;
}
</script>

<template>
  <v-progress-linear v-if="loadingBar" indeterminate></v-progress-linear>
  {{ isFormValid }}
  <h1>{{ catalog?.catalog_name }}</h1>

  <div class="d-flex flex-column flex-md-row">
    <ProductChoice class="flex-grow-1" v-if="catalog" :products="catalog?.products"
                   @onSelectProduct="onSelectProduct"></ProductChoice>
    <v-card :title="selectedRequirement?.title ? selectedRequirement.title : 'Title'"
            :text="selectedRequirement?.description ? selectedRequirement.description : 'Description'" class="my-2">
    </v-card>
  </div>

  <v-form v-model="isFormValid" validate-on="lazy blur">

    <div class="d-flex flex-column-reverse flex-md-row">
      <v-select
          v-model="selectedLesson"
          :items="lessons"
          label="Lesson"
          :item-title="item => item.title"
          :item-value="item => item"
          required
      ></v-select>
      <v-btn type="submit" v-if="selectedLesson" @click="removeRequirements" class="my-2 pa-2 ml-4">
        Remove from Lesson
      </v-btn>
      <v-btn type="button" v-if="!selectedLesson" class="my-2 pa-2 ml-4">
        Add new lesson to catalog
      </v-btn>
      <v-btn type="button" @click="onReset" class="my-2 pa-2 ml-4">Whole Catalog</v-btn>
    </div>

    <EasyDataTable
        :headers="selectedLesson ? headersForLesson : headers"
        :items="items"
        :loading="loading"
        :theme-color="themeColor"
        :rows-items="[5, 10, 15, 25, 50]"
        :rows-per-page="10"
        table-class-name="customize-table"
        @click-row="onRowClick">

      <template #header-select="header">
        <div>
          {{ header.text }}
          <v-checkbox v-model="selectAll" @click="toggleSelection"
                      :label="selectAll ? 'Deselect All' : 'Select All'"></v-checkbox>
        </div>
      </template>

      <template #item-select="item">
        <v-checkbox v-model="reqGroupSelection" :value="item.requirement_id"
                    label="" :rules="[checkBoxMinimumRule]"></v-checkbox>
      </template>

      <template #item-productQualification="item">
        {{ item.products[selectedProduct]?.qualification }}
      </template>

      <template #item-productComment="item">
        {{ item.products[selectedProduct]?.comment }}
      </template>
    </EasyDataTable>
  </v-form>
</template>

<style scoped>

.customize-table {
  --easy-table-border: 1px solid #445269;
  --easy-table-row-border: 1px solid #445269;

  --easy-table-header-font-size: 14px;
  --easy-table-header-height: 50px;
  --easy-table-header-font-color: #c1cad4;
  --easy-table-header-background-color: #2d3a4f;

  --easy-table-header-item-padding: 10px 15px;

  --easy-table-body-even-row-font-color: #fff;
  --easy-table-body-even-row-background-color: #4c5d7a;

  --easy-table-body-row-font-color: #c0c7d2;
  --easy-table-body-row-background-color: #2d3a4f;
  --easy-table-body-row-height: 50px;
  --easy-table-body-row-font-size: 14px;

  --easy-table-body-row-hover-font-color: #2d3a4f;
  --easy-table-body-row-hover-background-color: #eee;

  --easy-table-body-item-padding: 10px 15px;

  --easy-table-footer-background-color: #2d3a4f;
  --easy-table-footer-font-color: #c0c7d2;
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

  --easy-table-loading-mask-background-color: #2d3a4f;
}
</style>