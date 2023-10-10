<script setup lang="ts">
import {useCatalogStore} from "@/stores/catalog.store.ts";
import {Catalog, Requirement} from "@/types/catalog.types.ts";
import AlertService from "@/services/alert.service.ts";
import {useLessonStore} from "@/stores/lesson.store.ts";
import {Lesson} from "@/types/lesson.types.ts";
import router from "@/router";
import ProductChoice from "@/components/Catalogs/ProductChoice.component.vue"

const catalog = ref<Catalog>();
const catalogStore = useCatalogStore();
let catalogIdAsNumber: number = 0;
const lessonStore = useLessonStore();

const loading = ref<boolean>(true);
const loadingBar = ref<boolean>(false);
const items = ref<Requirement[]>([]);
const themeColor = "#6e4aff";
const selectAll = ref<boolean>(false);
const selectedProduct = ref();
const lessons = ref<Lesson[]>();
const selectedLesson = ref<Lesson | null>();

const selection = ref<number[]>([]);

const isFormValid = ref(false);

const headers = [
  {text: 'Selection', value: 'select'},
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
      selection.value = [];
      loadedReqs.forEach(req => {
        selection.value.push(req.requirement_id);
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

function onSelectProduct(name: string) {
  selectedProduct.value = name;
}

function onReset() {
  selectedLesson.value = null;
  setUpCatalog();
}

function toggleSelection() {
  selectAll.value = !selectAll.value;
  if (selectAll.value) {
    selection.value = [];
    items.value.forEach(item => {
      selection.value.push(item.requirement_id);
    })
  } else {
    selection.value = [];
  }
}

async function removeRequirements() {
  loadingBar.value = true;
  if (selection.value.length > 0 && selectedLesson.value) {
    try {
      await catalogStore.removeRequirementsFromLesson(selectedLesson.value.id, selection.value);
      AlertService.addSuccessAlert("Requirements removed from " + selectedLesson.value?.id + " " + selectedLesson.value?.title);
      await router.push({name: "Catalogs"})
    } catch (error: any) {
      AlertService.addErrorAlert("Failed to remove catalog and requirements: " + error.message);
    }
    loadingBar.value = false;
  }
}

async function addRequirements() {
  loadingBar.value = true;
  if (selection.value.length > 0 && selectedLesson.value) {
    try {
      await catalogStore.setCatalogAndRequirementsToLesson(selectedLesson.value.id, selection.value);
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

  <h1>{{ catalog?.catalog_name }}</h1>

  <ProductChoice v-if="catalog" :products="catalog?.products" @onSelectProduct="onSelectProduct"></ProductChoice>

  <v-form>
    <v-btn @click="addRequirements" class="my-2 pa-1">
      Add Requirements to Lesson {{ selectedLesson?.title }}
    </v-btn>

    <v-btn @click="removeRequirements" class="my-2 pa-1 ml-2">
      Remove Requirements from Lesson {{ selectedLesson?.title }}
    </v-btn>

    <v-btn @click="onReset">Whole Catalog</v-btn>
    <v-select
        v-model="selectedLesson"
        :items="lessons"
        :rules="[v => !!v || 'Eine Lektion wird benötigt.']"
        label="Lesson"
        :item-title="item => item.title"
        :item-value="item => item"
        required
    ></v-select>

    <EasyDataTable
        :headers="headers"
        :items="items"
        :loading="loading"
        :theme-color="themeColor"
        :rows-items="[5, 10, 15, 25, 50]"
        :rows-per-page="10"
        table-class-name="customize-table">

      <template #header-select="header">
        <div>
          {{ header.text }}
          <v-checkbox v-model="selectAll" @click="toggleSelection" :label="selectAll ? 'Remove All' : 'Select All'"></v-checkbox>
        </div>
      </template>

      <template #item-select="item">
        <v-checkbox v-model="selection" :value="item.requirement_id"
                    label=""></v-checkbox>
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