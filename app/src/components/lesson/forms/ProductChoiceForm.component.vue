<script setup lang="ts">

import {useLessonFormStore} from "@/stores/lessonForm.store.ts";
import {requiredHyperlinkRule, requiredStringRule, requiredNumberRule} from "@/utils/validationRules.ts";
import ProductQualification from "@/components/catalog/product/ProductQualification.component.vue";

const icons = [
  {name: "Instagram", icon: "mdi-instagram"},
  {name: "Github", icon: "mdi-github"},
  {name: "Gitlab", icon: "mdi-gitlab"},
  {name: "Twitter", icon: "mdi-twitter"},
  {name: "Twitch", icon: "mdi-twitch"},
  {name: "CreditCard", icon: "mdi-credit-card"},
  {name: "Cash", icon: "mdi-cash"},
  {name: "Google", icon: "mdi-google"},
  {name: "Clipboard", icon: "mdi-clipboard"},
  {name: "Pencil", icon: "mdi-pencil-box"},
  {name: "Book", icon: "mdi-book-open"},
  {name: "Board", icon: "mdi-developer-board"},
];

const props = defineProps<{ componentId: string }>();
const lessonFormStore = useLessonFormStore();

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
  solution: Solution | undefined
}

const products = ref<Product[]>([]);

init();

function init() {
  products.value = lessonFormStore.getComponentFieldValues(props.componentId, 'options') || [{
    id: 0,
    name: "",
    link: "",
    icon: "",
    checkQualification: false,
    solution: undefined,
  }];

  const storedSolutions = lessonFormStore.getComponentFieldValues(props.componentId, 'solution');
  if (storedSolutions) {
    products.value.forEach(product => {
      const found = storedSolutions.find((solution: any) => solution.id === product.id);
      if (found) {
        product.solution = found;
      }
    })
  }
  updateStoreData();
}

function updateStoreData() {

  const productsToSave = products.value.map(p => ({
    id: p.id,
    name: p.name,
    link: p.link,
    icon: p.icon,
    checkQualification: p.checkQualification
  }));

  const solutionsToSave = products.value
      .filter(p => p.solution !== undefined)
      .map(p => ({
        id: p.id,
        qualification: p.solution?.qualification,
        tolerance: p.solution?.tolerance
      }));

  lessonFormStore.setComponentData(props.componentId, 'options', productsToSave);
  lessonFormStore.setComponentData(props.componentId, 'solution', solutionsToSave);
}

const addOptionsField = () => {
  products.value.push({
    id: products.value.length,
    name: "",
    link: "",
    icon: "",
    checkQualification: false,
    solution: undefined
  });
};

function addSolutionsField(product: Product) {
  product.solution = {
    id: product.id,
    qualification: 1,
    tolerance: 0
  }
}

const removeField = (index: number) => {
  products.value.splice(index, 1);
};

watch(products, (newProducts) => {

  newProducts.forEach((product: Product) => {
    if (product.checkQualification) {
      if (product.solution === undefined) {
        addSolutionsField(product);
      }
    } else {
      if (product.solution) {
        product.solution = undefined;
      }
    }
  })

  updateStoreData()
}, {deep: true});

</script>

<template>
  <v-container>
    <div v-for="(product, index) in products" :key="index">
      <v-row>
        <v-col :cols="index > 0 ? '2':'3'">
          <v-text-field
              v-model="product.name"
              label="Produkt Name"
              variant="outlined"
              :rules="[requiredStringRule]"
          ></v-text-field>
        </v-col>
        <v-col cols="5">
          <v-text-field
              v-model="product.link"
              label="Produkt Hyperlink"
              variant="outlined"
              :rules="[requiredHyperlinkRule, requiredStringRule]"
          ></v-text-field>
        </v-col>
        <v-col cols="2">
          <v-select
              v-model="product.icon"
              variant="outlined"
              density="comfortable"
              label="Icon"
              :items="icons"
              item-title="name"
              item-value="icon"
              clearable
          >
            <template v-slot:item="{ props, item }">
              <v-list-item v-bind="props" :prepend-icon="item.raw.icon"></v-list-item>
            </template>
          </v-select>
        </v-col>
        <v-col cols="2">
          <v-switch v-model="product.checkQualification" label="Qualifizierung"></v-switch>
        </v-col>
        <v-col v-if="index > 0" cols="1">
          <v-btn icon @click="removeField(index)">
            <v-icon>
              mdi-delete
            </v-icon>
          </v-btn>
        </v-col>
      </v-row>

      <v-row v-if="product.checkQualification && product.solution !== undefined">
        <v-col cols="4">
          <v-text-field
              label="Qualifizierung"
              v-model="product.solution.qualification"
              :min="1"
              :max="5"
              variant="outlined"
              type="number"
              :rules="[requiredNumberRule]"
          ></v-text-field>
        </v-col>
        <v-col cols="4">
          <v-text-field
              label="Toleranzbereich"
              v-model="product.solution.tolerance"
              :min="0"
              :max="product.solution.qualification"
              :rules="[requiredNumberRule]"
              variant="outlined"
              type="number"
          ></v-text-field>
        </v-col>
        <v-col cols="4">
          <ProductQualification :size="80"
                                :qualification="product.solution.qualification + ''"></ProductQualification>
        </v-col>
      </v-row>
      <v-divider v-if="index < products.length-1" class="my-5"></v-divider>
    </div>

    <v-row>
      <v-col cols="12">
        <v-btn @click="addOptionsField" icon>
          <v-icon>
            mdi-plus
          </v-icon>
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>
