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

const solutions = ref<{
  id: number,
  qualification: number,
  tolerance: number
}[]>([]);

const fields = ref<any>({
  options: lessonFormStore.getComponentFieldValues(props.componentId, 'options') || [{
    id: 0,
    name: "",
    link: "",
    icon: "",
    checkQualification: false,
  }],
});

init();

function init() {
  const storedSolutions = lessonFormStore.getComponentFieldValues(props.componentId, 'solution');
  if (storedSolutions) {
    solutions.value = storedSolutions;
  }
}

updateStoreData();

function updateStoreData() {
  lessonFormStore.setComponentData(props.componentId, 'options', fields.value.options);
  lessonFormStore.setComponentData(props.componentId, 'solution', solutions.value);
}

const addOptionsField = () => {
  fields.value.options.push({
    id: fields.value.options.length,
    name: "",
    link: "",
    icon: "",
    checkQualification: false,
  });
};

const removeField = (index: number, id: number) => {
  fields.value.options.splice(index, 1);
  const found = solutions.value[id];
  if (found) solutions.value.splice(id, 1);
};

watch(fields.value.options, (newFields) => {

  newFields.forEach((option: any) => {
    const found = solutions.value[option.id];
    if (found) {
      if (!option.checkQualification) {
        solutions.value.splice(option.id, 1);
      }
    } else if (option.checkQualification) {
      solutions.value[option.id] = ({
        id: option.id,
        qualification: 0,
        tolerance: 0
      });
    }
  })

  fields.value.options = newFields;
  updateStoreData()
}, {deep: true});

watch(solutions, (newSolutions) => {
  solutions.value = newSolutions;
  updateStoreData()
}, {deep: true});
</script>

<template>
  <v-container>
    <div v-for="(product, index) in fields.options" :key="index">
      <v-row>
        <v-col :cols="index > 0 ? '2':'3'">
          <v-text-field
              v-model="fields.options[index].name"
              label="Produkt Name"
              variant="outlined"
              :rules="[requiredStringRule]"
          ></v-text-field>
        </v-col>
        <v-col cols="5">
          <v-text-field
              v-model="fields.options[index].link"
              label="Produkt Hyperlink"
              variant="outlined"
              :rules="[requiredHyperlinkRule, requiredStringRule]"
          ></v-text-field>
        </v-col>
        <v-col cols="2">
          <v-select
              v-model="fields.options[index].icon"
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
          <v-switch v-model="fields.options[index].checkQualification" label="Qualifizierung"></v-switch>
        </v-col>
        <v-col v-if="index > 0" cols="1">
          <v-btn icon @click="removeField(index, product.id)">
            <v-icon>
              mdi-delete
            </v-icon>
          </v-btn>
        </v-col>
      </v-row>

      <v-row v-if="product.checkQualification && solutions[product.id]">
        <v-col cols="4">
          <v-text-field
              label="Qualifizierung"
              v-model="solutions[product.id].qualification"
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
              v-model="solutions[product.id].tolerance"
              :min="0"
              :max="solutions[product.id].qualification"
              :rules="[requiredNumberRule]"
              variant="outlined"
              type="number"
          ></v-text-field>
        </v-col>
        <v-col cols="4">
          <ProductQualification :size="80"
                                :qualification="solutions[product.id].qualification + ''"></ProductQualification>
        </v-col>
      </v-row>
      <v-divider v-if="index < fields.options.length-1" class="my-5"></v-divider>
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
