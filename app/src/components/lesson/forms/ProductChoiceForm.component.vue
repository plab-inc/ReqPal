<script setup lang="ts">

import {useLessonFormStore} from "@/stores/lessonForm.store.ts";
import {requiredRule, requiredHyperlinkRule, requiredStringRule} from "@/utils/validationRules.ts";

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

const fields = ref<any>({
  options: lessonFormStore.getComponentFieldValues(props.componentId, 'options') || [{ name: "", link: "", icon: "" }],
});

updateStoreData(fields.value);

function updateStoreData(fields: any) {
  lessonFormStore.setComponentData(props.componentId, 'options', fields.options);
}

const addField = () => {
  fields.value.options.push({ name: "", link: "", icon: "" });
};

const removeField = (index: number) => {
  fields.value.options.splice(index, 1);
};

watch(fields, (newFields) => {
  updateStoreData(newFields)
}, {deep: true});

</script>

<template>
  <v-container>
    <v-row v-for="(product, index) in fields.options" :key="index">
      <v-col :cols="index > 0 ? '4':'5'">
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
      <v-col cols="1">
        <v-btn icon v-if="index > 0" @click="removeField(index)">
          <v-icon>
            mdi-delete
          </v-icon>
        </v-btn>
      </v-col>

    </v-row>
    <v-row>
      <v-col cols="12">
        <v-btn @click="addField" icon>
          <v-icon>
          mdi-plus
        </v-icon>
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>
