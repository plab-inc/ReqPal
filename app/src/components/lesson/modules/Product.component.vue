<script setup lang="ts">
import ProductItem from "@/components/catalog/product/ProductItem.component.vue";
import {ref} from "vue";
import Help from "@/components/lesson/modules/Help.component.vue";
import {useLessonStore} from "@/stores/lesson.store.ts";
import ProductQualification from "@/components/catalog/product/ProductQualification.component.vue";
import {useAuthStore} from "@/stores/auth.store.ts";
import Hint from "@/components/lesson/modules/Hint.component.vue";

interface Props {
  componentId: string,
}

type Solution = {
  id: number,
  qualification: number,
  tolerance: number
}

type Product = {
  id: number,
  name: string,
  link: string,
  icon: string,
  checkQualification: boolean,
  solution?: Solution | undefined,
  input: number
}

const props = defineProps<Props>();

const lessonStore = useLessonStore();

const products = ref<Product[]>([]);
const productsWithTask = ref<Product[]>([]);
const authStore = useAuthStore();
const isTeacher: boolean = authStore.isTeacher;

const fields = ref<any>({
  hint: lessonStore.getComponentFieldValues(props.componentId, 'hint'),
  questionId: lessonStore.getComponentFieldValues(props.componentId, 'uuid')
});

function openLink(link: string) {
  window.open(link);
}

init();

function init() {
  const storedOptions = lessonStore.getComponentFieldValues(props.componentId, 'options') || [{
    id: 0,
    name: "",
    link: "",
    icon: "",
    checkQualification: false,
    solution: undefined,
    input: 1
  }];

  if (storedOptions) {
    products.value = storedOptions.map((p: any) => ({
      id: p.id,
      name: p.name,
      link: p.link,
      icon: p.icon,
      checkQualification: p.checkQualification
    }));

    storedOptions.forEach((p: any) => {
      if (p.checkQualification) {
        productsWithTask.value.push({
          id: p.id,
          name: p.name,
          link: p.link,
          icon: p.icon,
          checkQualification: p.checkQualification,
          input: p.hasOwnProperty('input') ? p.input : 1
        })
      }
    })
  }

  const solutions = lessonStore.getComponentFieldValues(props.componentId, 'solution');

  if (solutions) {
    productsWithTask.value.forEach((product: any) => {
      const found = solutions.find((s: any) => s.id === product.id);
      if (found) {
        product.solution = found;
        if (isTeacher) {
          product.input = product.solution.qualification;
        }
      }
    })
  }
}

function checkSolution(product: Product) {
  if (product.solution) {
    let minValue: number = getMinValueForProduct(product);
    let maxValue: number = getMaxValueForProduct(product);
    return (+product.input >= +minValue && +product.input <= +maxValue)
  }
}

function getMinValueForProduct(product: Product) {
  const solution = product.solution;
  if (solution) {
    const min : number = +solution.qualification - +solution.tolerance;
    if(min < 0) return 0;
    return min;
  }
  return -1;
}

function getMaxValueForProduct(product: Product) {
  const solution = product.solution;
  if (solution) {
    const max : number = +solution.qualification + +solution.tolerance;
    if(max > +solution.qualification) return +solution.qualification;
    return max;
  }
  return -1;
}

function updateStoreData(options: any) {
  lessonStore.setComponentData(props.componentId, 'options', options);
}

watch(productsWithTask, (newProductsWithTask) => {

  const updatedOptions = products.value.filter(p => !p.checkQualification);

  newProductsWithTask.forEach(p => {
    updatedOptions.push({
      id: p.id,
      name: p.name,
      link: p.link,
      icon: p.icon,
      checkQualification: p.checkQualification,
      input: p.input
    })
  })

  updateStoreData(updatedOptions);
}, {deep: true});

</script>

<template>
  <v-expansion-panels>
    <v-expansion-panel elevation="0">
      <v-expansion-panel-title>
        Produkte
      </v-expansion-panel-title>
      <v-expansion-panel-text>
        <v-container>
          <v-row>
            <v-col class="d-flex justify-end">
              <Help dialog-type="productExplanation"></Help>
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <v-row>
                <v-col v-for="product in products" :key="product.id" :md="12/products.length">
                  <ProductItem :options="product"></ProductItem>
                </v-col>
              </v-row>
            </v-col>
          </v-row>
        </v-container>
      </v-expansion-panel-text>
    </v-expansion-panel>
  </v-expansion-panels>

  <v-container v-if="productsWithTask.length > 0">

    <v-card variant="flat">
      <v-container>
        <div v-for="product in productsWithTask" class="my-5">
          <v-row>

            <v-col v-if="product.solution">
              <div class="text-h6 mb-2">Ihre Antwort: {{ product.input }}</div>
              <div class="text-h6 mb-2">Richtige Antwort: {{ product.solution?.qualification }}</div>
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
                  <div class="text-h6">Bewerte das Produkt
                    <span><router-link to="" @click="openLink(product.link)" class="link text-info">{{
                        product.name
                      }}</router-link></span>
                    nach Eignung von 1 bis 5.
                  </div>
                </v-col>
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
                  <div class="text-h6 text-center">Bewertung</div>
                </v-col>
                <v-col>
                  <div class="d-flex align-center justify-center">
                    <ProductQualification :size="80"
                                          :qualification="product.solution ? product.solution.qualification + '' : product.input + ''">
                    </ProductQualification>
                  </div>
                </v-col>
              </v-row>
            </v-col>

          </v-row>
        </div>
        <v-row>
          <v-col class="d-flex flex-grow-1 align-end justify-end">
            <div class="mr-2">
              <Help dialog-type="productQualificationExplanation"></Help>
            </div>
            <div>
              <Hint v-if="fields.hint" :hint="fields.hint" :questionId="fields.questionId"></Hint>
            </div>
          </v-col>
        </v-row>
      </v-container>

    </v-card>

  </v-container>

</template>

<style scoped>
.link {
  text-decoration: none;
}
</style>
