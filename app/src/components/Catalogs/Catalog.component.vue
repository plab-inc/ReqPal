<script setup lang="ts">
import {useCatalogStore} from "@/stores/catalog.store.ts";
import {Catalog, Product, Requirement} from "@/types/catalog.types.ts";
import AlertService from "@/services/alert.service.ts";
import {Lesson} from "@/types/lesson.types.ts";
import router from "@/router";
import {requiredRule} from "@/utils/validationRules.ts";
import {useLessonStore} from "@/stores/lesson.store.ts";
import ProdutDetailPanel from "@/components/Catalogs/Product/ProdutDetailPanel.component.vue";
import RequirementItem from "@/components/Catalogs/Requirement/RequirementItem.component.vue";
import CatalogTable from "@/components/Catalogs/CatalogTable.component.vue";

const catalog = ref<Catalog>();
const catalogProducts = ref<Product[]>([]);
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
  required: requiredRule
};

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
  console.log(reqGroupSelection.value)
  console.log(selectedLesson.value)

  if (reqGroupSelection.value.length > 0 && selectedLesson.value) {
    try {
      await catalogStore.setCatalogAndRequirementsToLesson(selectedLesson.value.id, reqGroupSelection.value);
      AlertService.addSuccessAlert("Requirements added to " + selectedLesson.value?.id + " " + selectedLesson.value?.title);
      await router.push({name: "Catalogs"})
    } catch (error: any) {
      AlertService.addErrorAlert("Failed to add catalog and requirements: " + error.message);
    }
  } else {
    AlertService.addWarningAlert("Es fehlen Daten zum Abschicken.");
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
    if (catalog.value) {
      if (catalog.value.requirements) {
        requirementItems.value = catalog.value.requirements;
      }
      catalogProducts.value = catalog.value.products;
    }
  } else {
    AlertService.addWarningAlert("Kein Katalog gefunden mit der id: " + catalogIdAsNumber);
  }
  loading.value = false;
}
</script>

<template>
  <v-container>
    <v-row>
      <v-col>
        <div class="text-md-h3 text-sm-h4 text-h6">{{ catalog?.catalog_name }}</div>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-col>
          <RequirementItem :requirement="selectedRequirement"></RequirementItem>
        </v-col>
        <v-col>
          <ProdutDetailPanel :requirement="selectedRequirement" :products="catalogProducts"
                             :loading="loadingBar"></ProdutDetailPanel>
        </v-col>
      </v-col>

      <v-col>
        <v-form v-model="isFormValid" validate-on="lazy blur" @submit.prevent="onSubmit">

          <div class="d-flex justify-center flex-column flex-md-row justify-md-start">
            <v-btn type="button" @click="onReset" class="my-2 pa-2">Zurücksetzen</v-btn>
            <v-btn type="button" @click="toggleAllLessons" class="my-2 pa-2 ml-md-4">
              {{ showAllLessons ? 'Lektionen zum Katalog' : 'Alle Lektionen' }}
            </v-btn>
            <v-btn type="button" v-if="selectedLesson" @click="toggleNewRequirements" class="my-2 pa-2 ml-md-4">
              {{ showNewReqsForLesson ? 'Zugeteilte Anforderungen' : 'Neue Anforderungen' }}
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

          <CatalogTable :loading="loading" :requirement-items="requirementItems" v-model="reqGroupSelection"
                        :show-headers-for-lesson="!!selectedLesson" @on-row-click="onRowClick"
          ></CatalogTable>

        </v-form>
      </v-col>
    </v-row>
  </v-container>

</template>
