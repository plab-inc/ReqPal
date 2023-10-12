<script setup lang="ts">
import {useCatalogStore} from "@/stores/catalog.store.ts";
import {Catalog, Requirement} from "@/types/catalog.types.ts";
import ProductSelect from "@/components/Catalogs/Product/ProductNotes/ProductSelect.component.vue";
import RequirementPanel from "@/components/Catalogs/Requirement/RequirementPanel.component.vue";
import ProductNotes from "@/components/Catalogs/Product/ProductNotes/ProductNotes.component.vue";
import {Lesson} from "@/types/lesson.types.ts";

const catalogStore = useCatalogStore();

interface Props {
  lesson: Lesson;
}

interface ProductNote {
  id: string,
  text: string
}

const props = defineProps<Props>();
const requirements = ref<Requirement[]>([]);
const catalog = ref<Catalog>();

const currentProductName = ref<string>("");
const productNotes = ref<ProductNote[]>([]);
const currentNotes = ref<string>("");

function onSelectProduct(product: string) {
  saveProductNotes(currentProductName.value);
  currentProductName.value = product;
  setProductNotes(currentProductName.value);
}

function saveProductNotes(product: string) {
  const note = productNotes.value.find(p => p.id === product)
  if (note) {
    note.text = currentNotes.value;
  } else {
    productNotes.value.push({
      id: product,
      text: currentNotes.value
    })
  }
}

function setProductNotes(product: string) {
  const note = productNotes.value.find(p => p.id === product)
  if (note) {
    currentNotes.value = note.text;
  } else {
    currentNotes.value = "";
  }
}

onBeforeMount(async () => {
  await catalogStore.getRequirementsForLesson(props.lesson.id);
  if (props.lesson.catalog_id) {
    await catalogStore.getCatalogWithProductsById(props.lesson.catalog_id);
    requirements.value = catalogStore.currentLessonRequirements;
    if (catalogStore.currentCatalog) {
      catalog.value = catalogStore.currentCatalog;
      catalog.value?.products.forEach(product => {
        productNotes.value.push({
          id: product.product_name,
          text: ""
        })
      })
      onSelectProduct(catalog.value?.products[0].product_name);
    }
  }
})

</script>

<template>
  <div class="text-md-h4 text-sm-h5 text-h6">{{ catalog?.catalog_name }}</div>

  <ProductSelect v-if="catalog" :products="catalog?.products" :text-label="'Notizen für: '"
                 @onSelectProduct="onSelectProduct"></ProductSelect>

  <v-row>
    <v-col md="8">
      <RequirementPanel :requirements="requirements"></RequirementPanel>
    </v-col>
    <v-col md="4">
      <div v-if="currentProductName">
        <ProductNotes v-model="currentNotes" :textLabel="'Notizen für ' + currentProductName"></ProductNotes>
      </div>
    </v-col>
  </v-row>

</template>

<style scoped>

</style>