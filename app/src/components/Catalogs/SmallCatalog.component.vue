<script setup lang="ts">
import {useCatalogStore} from "@/stores/catalog.store.ts";
import {Catalog, Product, Requirement} from "@/types/catalog.types.ts";

const catalogStore = useCatalogStore();

interface Props {
  lessonId: number;
}

const props = defineProps<Props>();
const requirements = ref<Requirement[]>([]);
const catalog = ref<Catalog>();

const currentProduct = ref<Product>();

function onSelectProduct(product: Product) {
  currentProduct.value = product;
}

onBeforeMount(async () => {
  await catalogStore.getRequirementsForLesson(props.lessonId);
  await catalogStore.getWholeCatalogById(171);
  requirements.value = catalogStore.currentLessonRequirements;
  if (catalogStore.currentCatalog) {
    catalog.value = catalogStore.currentCatalog;
    currentProduct.value = catalog.value?.products[0];
  }
})

</script>

<template>
  <h1>{{ catalog?.catalog_name }}</h1>

  <v-item-group mandatory>
    <v-container>
      <v-row>
        <v-col
            :md="2" class="text-h5 d-flex justify-start align-center">
          Write notes for product:
        </v-col>
        <v-col
            v-for="product in catalog?.products"
            :key="product.product_id"
            :md="2"
        >
          <v-item v-slot="{ isSelected, toggle }">
            <v-card
                :color="isSelected ? 'primary' : ''"
                class="d-flex align-center"
                dark
                height="75"
                @click="() => { if (toggle) { toggle(); } onSelectProduct(product); }"
            >
              <v-scroll-y-transition>
                <div
                    class="text-h5 flex-grow-1 text-center"
                >
                  {{ product.product_name }}
                </div>
              </v-scroll-y-transition>
            </v-card>
          </v-item>
        </v-col>
      </v-row>
    </v-container>
  </v-item-group>

  <h1>Requirements</h1>
  <v-row>
    <v-col md="8">
      <div>
        <v-card v-for="req of requirements" :title="req.title ? req.title : 'Title'"
                :text="req.description ? req.description : 'Description'" class="my-2"></v-card>
      </div>
    </v-col>
    <v-col md="4">
      <div v-if="currentProduct">
        <v-textarea :label="'Notes for product ' + currentProduct.product_name" variant="outlined"
                    auto-grow></v-textarea>
      </div>
    </v-col>
  </v-row>


</template>

<style scoped>

</style>