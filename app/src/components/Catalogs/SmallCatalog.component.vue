<script setup lang="ts">
import {useCatalogStore} from "@/stores/catalog.store.ts";
import {Catalog, Requirement} from "@/types/catalog.types.ts";
import ProductChoice from "@/components/Catalogs/ProductChoice.component.vue";

const catalogStore = useCatalogStore();

interface Props {
  lessonId: number;
}

const props = defineProps<Props>();
const requirements = ref<Requirement[]>([]);
const catalog = ref<Catalog>();

const currentProductName = ref<String>();

function onSelectProduct(product: String) {
  currentProductName.value = product;
}

onBeforeMount(async () => {
  await catalogStore.getRequirementsForLesson(props.lessonId);
  await catalogStore.getWholeCatalogById(171);
  requirements.value = catalogStore.currentLessonRequirements;
  if (catalogStore.currentCatalog) {
    catalog.value = catalogStore.currentCatalog;
    currentProductName.value = catalog.value?.products[0].product_name;
  }
})

</script>

<template>
  <h1>{{ catalog?.catalog_name }}</h1>

  <ProductChoice v-if="catalog" :products="catalog?.products" @onSelectProduct="onSelectProduct"></ProductChoice>

  <h1>Requirements</h1>
  <v-row>
    <v-col md="8">
      <div>
        <v-card v-for="req of requirements" :title="req.title ? req.title : 'Title'"
                :text="req.description ? req.description : 'Description'" class="my-2"></v-card>
      </div>
    </v-col>
    <v-col md="4">
      <div v-if="currentProductName">
        <v-textarea :label="'Notes for product ' + currentProductName" variant="outlined"
                    auto-grow></v-textarea>
      </div>
    </v-col>
  </v-row>


</template>

<style scoped>

</style>