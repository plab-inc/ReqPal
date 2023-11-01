<script setup lang="ts">
import ProductItem from "@/components/catalog/product/ProductItem.component.vue";
import {ref} from "vue";
import Help from "@/components/lesson/modules/Help.component.vue";
import {useLessonStore} from "@/stores/lesson.store.ts";
import ProductQualification from "@/components/catalog/product/ProductQualification.component.vue";

interface Props {
  componentId: string,
}

type Product = {
  id: number,
  name: string,
  link: string,
  icon: string,
  checkQualification: boolean,
  input: number
}

const props = defineProps<Props>();
const inputValues = ref<number[]>([]);

const lessonStore = useLessonStore();

const fields = ref<any>({
  options: lessonStore.getComponentFieldValues(props.componentId, 'options'),
  solution: lessonStore.getComponentFieldValues(props.componentId, 'solutions')
});

const productsWithTask = ref<Product[]>([]);

init();

function init() {
  if (fields.value && fields.value.options) {
    fields.value.options.forEach((option: any) => {
      if (option.checkQualification) {
        productsWithTask.value.push(option);
        inputValues.value[option.id] = 1;
      }
    })
  }
}

function updateStoreData(fields: any) {
  lessonStore.setComponentData(props.componentId, 'options', fields);
}

watch(inputValues, (newInputValues) => {
  const updatedProducts = productsWithTask.value.map((option: any) => ({
    id: option.id,
    name: option.name,
    link: option.link,
    icon: option.icon,
    checkQualification: option.checkQualification,
    input: newInputValues[option.id]
  }));

  const updatedOptions = fields.value.options.map((option: any) => {
    const found = updatedProducts.find((p) => p.id === option.id);
    return found ? found : option;
  });

  productsWithTask.value = updatedProducts;
  fields.value.options = updatedOptions;

  updateStoreData(updatedProducts);
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
                <v-col v-for="product in fields.options" :key="product.product_name" :md="12/fields.options.length">
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

            <v-col v-if="fields.solution" class="text-center">
              <div class="text-h6 mb-2">Richtige Antwort:</div>
            </v-col>

            <v-col md="6">
              <v-row>
                <v-col>
                  <div class="text-h6">Bewerte das Produkt <span class="text-info">{{ product.name }}</span> nach
                    Eignung
                    von 1 bis 5.
                  </div>
                </v-col>
                <v-col>
                  <div>
                    <v-slider
                        v-model="inputValues[product.id]"
                        :min="1"
                        :max="5"
                        :step="1"
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
                                          :qualification="inputValues[product.id] + ''"></ProductQualification>
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
          </v-col>
        </v-row>
      </v-container>

    </v-card>

  </v-container>

</template>

<style scoped>

</style>
