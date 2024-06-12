<template>
  <v-dialog
    :model-value="dialog"
    @update:model-value="close"
    opacity="0.3"
    max-width="900"
  >
    <v-card
      variant="elevated"
      class="pa-1"
    >
      <v-form ref="form" v-model="formValid">
        <v-card-title>
          {{ isNew ? "Neue Anforderung" : (localEditedRequirement.label ? localEditedRequirement.label : 'Requirement Id') }}
        </v-card-title>
        <v-divider />
        <v-card-text>
          <v-row>
            <v-col cols="8">
              <v-text-field v-model="localEditedRequirement.title" :rules="[requiredStringRule]" label="Titel"
                            variant="outlined" />
            </v-col>
            <v-col cols="4">
              <v-text-field v-model="localEditedRequirement.label" :rules="[requiredStringRule, requirementIdUniqueRule]" label="Requirement Id"
                            variant="outlined" />
            </v-col>
          </v-row>
          <v-textarea v-model="localEditedRequirement.description" :rules="[requiredStringRule]" label="Beschreibung"
                      variant="outlined" />
          <v-divider class="mb-1" />
          <v-row>
            <v-col
              :cols="(Object.keys(localEditedRequirement.products).indexOf(key.toString()) % 3 === 2 ? 12 : 6)"
              v-for="(productDetail, key) in localEditedRequirement.products"
              :key="key"
            >
              <div class="text-caption mb-2">
                {{ productDetail.product_name }}
              </div>
              <v-text-field :rules="[requiredStringRule]" variant="outlined" label="Kommentar"
                            v-model="productDetail.comment" />
              <v-slider
                color="warning"
                v-model="productDetail.qualification"
                :max="5"
                :min="0"
                :step="1"
                hide-details
                show-ticks
                density="compact"
                thumb-label
              />
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn :disabled="!formValid" color="success" @click="save">{{ isNew ? "Hinzufügen" : "Speichern" }}</v-btn>
          <v-btn color="info" @click="close">Schließen</v-btn>
        </v-card-actions>
      </v-form>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import catalogService from "@/services/database/catalog.ts";
import { Requirement } from "@/types/catalog.ts";
import { useCatalogStore } from "@/stores/catalog.ts";
import { requiredStringRule } from "@/utils/validationRules.ts";

const props = defineProps({
  dialog: Boolean,
  editedItem: Object,
  isNew: Boolean
});

const localEditedRequirement = ref<Requirement>(JSON.parse(JSON.stringify(props.editedItem)));
const catalogStore = useCatalogStore();

const formValid = ref(false);
const form = ref();

const emit = defineEmits(["update:dialog"]);

function close() {
  emit("update:dialog", false);
}

async function save() {
  if (form.value && !(await form.value.validate())) {
    return;
  }

  if (props.isNew && catalogStore.getCurrentCatalog) {
    const data = await catalogService.push.addRequirement(catalogStore.getCurrentCatalog.catalog_id, localEditedRequirement.value);

    if (data) {
      for (const [key, productDetail] of Object.entries(localEditedRequirement.value.products)) {
        await catalogService.push.insertProductDetailsForRequirement(key, productDetail, data.requirement_id);
      }

      localEditedRequirement.value.requirement_id = data.requirement_id;
      catalogStore.getCurrentCatalog?.requirements.push(localEditedRequirement.value);
    }

    close();
    return;
  }

  if (!areRequirementEquals()) {
    const updatedRequirements = await catalogService.push.updateRequirement(localEditedRequirement.value);

    if(updatedRequirements.length > 0) {
      console.log("Update Requirements");
      Object.assign(props.editedItem as Requirement, localEditedRequirement.value);
    }

  }

  if (!areProductsEquals()) {
    const updatedProductsRequirements = [];

    for (const [key, productDetail] of Object.entries(localEditedRequirement.value.products)) {
      const updatedProductRequirement = await catalogService.push.updateProductDetailsForRequirement(key, productDetail, localEditedRequirement.value.requirement_id);
      updatedProductsRequirements.push(...updatedProductRequirement)
    }

    if(updatedProductsRequirements.length > 0){
      console.log("Update Product Requirements");
      Object.assign(props.editedItem as Requirement, localEditedRequirement?.value);
    }

  }

  close();
}

function areRequirementEquals() {
  const localCopy = JSON.parse(JSON.stringify(localEditedRequirement.value));
  const propsCopy = JSON.parse(JSON.stringify(props.editedItem));

  delete localCopy.products;
  delete propsCopy.products;

  return JSON.stringify(localCopy) == JSON.stringify(propsCopy);
}

function areProductsEquals() {
  const localCopy = JSON.parse(JSON.stringify(localEditedRequirement.value.products));
  const propsCopy = JSON.parse(JSON.stringify(props.editedItem?.products));

  return JSON.stringify(localCopy) == JSON.stringify(propsCopy);
}

const requirementIdUniqueRule = (value: string) => {

  const trimmedValue = value.trimStart().trimEnd();

  if(trimmedValue === props.editedItem?.label) {
    return true;
  }

  if(catalogStore.getCurrentCatalog?.requirements.find(requirement => requirement.label === trimmedValue)){
    return 'Diese Requirement Id wird bereits verwendet';
  }

  return true;
}

watch(() => props.dialog, () => {
  localEditedRequirement.value = JSON.parse(JSON.stringify(props.editedItem));
}, { immediate: true });

</script>