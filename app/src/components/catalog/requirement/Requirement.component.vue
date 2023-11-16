<script setup lang="ts">
import {useCatalogStore} from "@/stores/catalog.store.ts";
import {Requirement} from "@/types/catalog.types.ts";
import {ref} from "vue";
import {useLessonStore} from "@/stores/lesson.store.ts";
import ProductQualification from "@/components/catalog/product/ProductQualification.component.vue";
import Hint from "@/components/lesson/lessonBuilder/Hint.component.vue";
import Help from "@/components/lesson/lessonBuilder/Help.component.vue";
import {useAuthStore} from "@/stores/auth.store.ts";

const requirement = ref<Requirement>();
const loading = ref<boolean>(false);
const products = ref<ProductOptions[]>([]);
const toleranceValue = ref<number>(0);
const authStore = useAuthStore();
const maxValue = 5;
const minValue = 1;

interface Props {
  componentId: string,
}

interface ProductOptions {
  id: number,
  name: string,
  link: string,
  solution?: string | undefined,
  input: number,
  comment: string | undefined
}

const props = defineProps<Props>();
const lessonStore = useLessonStore();
const fields = ref<any>({
  options: lessonStore.getComponentFieldValues(props.componentId, 'options'),
  hint: lessonStore.getComponentFieldValues(props.componentId, 'hint'),
  questionId: lessonStore.getComponentFieldValues(props.componentId, 'uuid'),
  question: lessonStore.getComponentFieldValues(props.componentId, 'question') || "Bewerten Sie die Produkte.",
  solution: lessonStore.getComponentFieldValues(props.componentId, 'solution') || undefined,
});

onBeforeMount(async () => {
  loading.value = true;

  if (fields.value.options) {
    if (fields.value.options.catalogId && fields.value.options.requirementId) {
      const catalogStore = useCatalogStore();
      await catalogStore.getCatalogWithProductsById(fields.value.options.catalogId);
      const reqs = catalogStore.currentCatalog?.requirements;
      if (reqs) {
        requirement.value = reqs.find(r => r.requirement_id === fields.value.options.requirementId);
      }

      if (requirement.value && fields.value.options.askForQualification) {
        let result;
        let savedInput = [];

        if (fields.value.options.hasOwnProperty("products")) {
          savedInput = fields.value.options.products;
        }

        for (const productId of fields.value.options.productIds) {
          if (fields.value.solution) {
            toleranceValue.value = fields.value.solution.toleranceValue;
            result = await catalogStore.fetchProductDetailsByRequirementWithQualificationByProductId(requirement.value.requirement_id, productId);
          } else {
            result = await catalogStore.fetchProductDetailsByRequirementWithoutQualificationByProductId(requirement.value.requirement_id, productId);
          }

          if (result) {
            let productDTO = await catalogStore.fetchProductById(result.product_id);
            if (productDTO) {
              products.value.push({
                id: productDTO.product_id,
                name: productDTO.product_name,
                link: productDTO.product_url,
                solution: result.qualification ? result.qualification : undefined,
                input: authStore.isTeacher ? result.qualification ? +result.qualification : minValue : savedInput.length > 0 ? savedInput.find((p: any) => p.id === productDTO?.product_id).input : minValue,
                comment: result.comment ? result.comment : undefined
              })
            }
          }
        }
      }
    }
  }
  loading.value = false;
})

function openLink(link: string) {
  window.open(link);
}

init();

function init() {
}

function checkSolution(product: ProductOptions) {
  if (product.solution) {
    let minValue: number = getMinValueForProduct(product);
    let maxValue: number = getMaxValueForProduct(product);
    return (+product.input >= +minValue && +product.input <= +maxValue)
  }
}

function getMinValueForProduct(product: ProductOptions) {
  if (product.solution) {
    const min: number = +product.solution - +toleranceValue.value;
    if (min < minValue) return minValue;
    return min;
  }
  return -1;
}

function getMaxValueForProduct(product: ProductOptions) {
  if (product.solution) {
    const max: number = +product.solution + +toleranceValue.value;
    if (max >= maxValue) return maxValue;
    return max;
  }
  return -1;
}

function updateStoreData(options: any) {
  lessonStore.setComponentData(props.componentId, 'options', options);
}

watch(products.value, (newProducts) => {

  let updatedOptions: { catalogId: any, requirementId: any, askForQualification: any, productIds: any, products: { id: number, input: number }[] } = {
    catalogId: fields.value.options.catalogId,
    requirementId: fields.value.options.requirementId,
    askForQualification: fields.value.options.askForQualification,
    productIds: fields.value.options.productIds,
    products: []
  }

  newProducts.forEach(p => {
    updatedOptions.products.push({
      id: p.id,
      input: p.input
    });
  });

  updateStoreData(updatedOptions);
}, {deep: true});
</script>

<template>
  <v-card :loading="loading"
          variant="outlined"
          color="success"
  >
    <v-card-title class="text-h4 text-decoration-underline">
      {{ requirement?.title ? requirement?.title : 'Der Katalog zu dieser Komponente ist nicht mehr verfügbar' }}
    </v-card-title>
    <v-card-text class="text-h5 mt-1">
      {{ requirement?.description ? requirement?.description : 'Wähle eine Anforderung' }}
    </v-card-text>
  </v-card>

  <v-container v-if="fields.options.askForQualification && products.length > 0">

    <v-row>
      <v-col>
        <div class="text-h6 my-5">{{ fields.options.question }}</div>
      </v-col>
    </v-row>

    <v-card variant="flat">
      <v-container>
        <div v-for="product in products" class="my-5">
          <v-row>

            <v-col v-if="product.solution">
              <div class="text-h6 mb-2">Ihre Antwort: {{ product.input }}</div>
              <div class="text-h6 mb-2">Richtige Antwort: {{ product.solution }}</div>
              <div
                  v-if="getMinValueForProduct(product) != getMaxValueForProduct(product)"
                  class="text-h6 mb-2">
                Toleranzbereich zwischen: {{ getMinValueForProduct(product) }} und {{
                  getMaxValueForProduct(product)
                }}
              </div>
            </v-col>

            <v-col md="6">
              <v-row>
                <v-col>
                  <router-link to="" @click="openLink(product.link)" class="text-h6 link text-info">{{ product.name }}
                  </router-link>
                </v-col>
              </v-row>
              <v-row>
                <v-col>
                  <div>
                    <v-slider
                        v-model="product.input"
                        :readonly="!!product.solution"
                        :min="1"
                        :max="5"
                        :step="1"
                        :color="product.solution && checkSolution(product) ? 'success' : 'orange'"
                        track-color="warning"
                        thumb-label>
                    </v-slider>
                  </div>
                </v-col>
              </v-row>
            </v-col>

            <v-col md="6">
              <v-row>
                <v-col>
                  <div class="text-h6 text-center">{{ product.solution ? 'Ideale Bewertung' : 'Bewertung' }}</div>
                </v-col>
                <v-col>
                  <div class="d-flex align-center justify-center">
                    <ProductQualification :size="80"
                                          :qualification="product.solution ? product.solution + '' : product.input + ''">
                    </ProductQualification>
                  </div>
                </v-col>
              </v-row>
            </v-col>

          </v-row>

          <v-row>
            <v-col class="d-flex flex-grow-1 align-end justify-end">
              <div class="mr-2">
                <Help dialog-type="productQualificationExplanation"></Help>
              </div>
              <div>
                <Hint v-if="product.comment" :hint="product.comment" :questionId="fields.questionId"></Hint>
              </div>
            </v-col>
          </v-row>
        </div>

      </v-container>

    </v-card>

  </v-container>

</template>

<style scoped>
.link {
  text-decoration: none;
}
</style>