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
import {useUtilStore} from "@/stores/util.store.ts";

const catalog = ref<Catalog>();
const catalogProducts = ref<Product[]>([]);
const catalogStore = useCatalogStore();
let catalogIdAsNumber: number = 0;

const utilStore = useUtilStore();

const lessonStore = useLessonStore();

const loading = ref<boolean>(true);
const loadingBar = ref<boolean>(false);

const requirementItems = ref<Requirement[]>([]);
const selectAll = ref<boolean>(false);

const showAllLessons = ref<boolean>(false);
const allLessons = ref<Lesson[]>();
const catalogLessons = ref<Lesson[]>([]);

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
  utilStore.toggleLoadingBar();
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
  utilStore.toggleLoadingBar();
}

watch(selectedLesson, (newLesson, oldLesson) => {
  if (newLesson && oldLesson !== newLesson) {
    onLessonChanged();
  }
});

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
  showAllLessons.value = false;
  setUpCatalog();
}

function toggleNewRequirements() {
  utilStore.toggleLoadingBar();
  reqGroupSelection.value = [];
  selectAll.value = false;
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
  utilStore.toggleLoadingBar();
}

async function removeRequirements() {
  utilStore.toggleLoadingBar();
  if (isFormValid && reqGroupSelection.value.length > 0 && selectedLesson.value) {
    try {
      await catalogStore.removeRequirementsFromLesson(selectedLesson.value.id, reqGroupSelection.value);
      AlertService.addSuccessAlert("Requirements removed from " + selectedLesson.value?.id + " " + selectedLesson.value?.title);
      await router.push({name: "Catalogs"})
    } catch (error: any) {
      AlertService.addErrorAlert("Failed to remove catalog and requirements: " + error.message);
    }
  }
  utilStore.toggleLoadingBar();
}

async function addRequirements() {
  utilStore.toggleLoadingBar();
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
  utilStore.toggleLoadingBar();
}

onBeforeMount(async () => {
  utilStore.toggleLoadingBar();
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
      showAllLessons.value = true;
      AlertService.addInfoAlert("Zu diesem Katalog gehören noch keine Lektionen.");
    }
  }
  utilStore.toggleLoadingBar();
})

function setUpCatalog() {
  loading.value = true;
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
        <RequirementItem :requirement="selectedRequirement"></RequirementItem>
      </v-col>
      <v-col>
        <ProdutDetailPanel :requirement="selectedRequirement" :products="catalogProducts"
                           :loading="loadingBar"></ProdutDetailPanel>
      </v-col>
    </v-row>

    <v-row>
      <v-col>
        <v-form v-model="isFormValid" validate-on="lazy blur" @submit.prevent="onSubmit">
          <v-row>
            <v-col md="8">
              <v-row>
                <v-col>
                  <v-btn type="button" @click="onReset" class="pa-2">Zurücksetzen</v-btn>
                  <v-btn type="submit" v-if="selectedLesson"
                         class="pa-2 ml-sm-2">
                    {{ showNewReqsForLesson ? 'Anforderungen hinzufügen' : 'Anforderungen entfernen' }}
                  </v-btn>
                </v-col>
              </v-row>
              <v-row>
                <v-col>
                  <v-select
                      v-model="selectedLesson"
                      :items="showAllLessons ? allLessons : catalogLessons"
                      :label="showAllLessons ? 'Alle Lektionen' : 'Lektionen zum Katalog'"
                      :item-title="item => item.title"
                      :item-value="item => item"
                      required
                  ></v-select>
                </v-col>
              </v-row>
            </v-col>

            <v-col md="4">
              <v-row>
                <v-col>
                  <v-switch
                      v-if="selectedLesson"
                      v-model="showNewReqsForLesson"
                      @change="toggleNewRequirements"
                      hide-details
                      inset
                      :label="showNewReqsForLesson ? 'Neue Anforderungen' : 'Zugeteilte Anforderungen'"
                  ></v-switch>
                  <v-switch
                      v-model="showAllLessons"
                      hide-details
                      inset
                      :disabled="catalogLessons.length <= 0"
                      :label="showAllLessons ? 'Alle Lektionen' : 'Lektionen zum Katalog'"
                  ></v-switch>
                </v-col>
              </v-row>
            </v-col>
          </v-row>

          <v-row>
            <v-col>
              <CatalogTable :loading="loading" :requirement-items="requirementItems" v-model="reqGroupSelection"
                            :show-headers-for-lesson="!!selectedLesson" @on-row-click="onRowClick"
              ></CatalogTable>
            </v-col>
          </v-row>

        </v-form>
      </v-col>
    </v-row>
  </v-container>

</template>
