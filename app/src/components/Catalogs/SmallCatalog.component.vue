<script setup lang="ts">
import {useCatalogStore} from "@/stores/catalog.store.ts";
import {Catalog, Requirement} from "@/types/catalog.types.ts";
import ProductChoice from "@/components/Catalogs/ProductChoice.component.vue";

const catalogStore = useCatalogStore();

interface Props {
  lessonId: number;
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
  await catalogStore.getRequirementsForLesson(props.lessonId);
  await catalogStore.getCatalogWithProductsById(171);
  requirements.value = catalogStore.currentLessonRequirements;
  if (catalogStore.currentCatalog) {
    catalog.value = catalogStore.currentCatalog;
    catalog.value?.products.forEach(product => {
      productNotes.value.push({
        id: product.product_name,
        text: "Notizen für: " + product.product_name
      })
    })
    onSelectProduct(catalog.value?.products[0].product_name);
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
        <v-textarea v-model="currentNotes"
                    :label="'Notes for product ' + currentProductName"
                    variant="outlined"
                    auto-grow></v-textarea>
      </div>
    </v-col>
  </v-row>


</template>

<style scoped>

</style>