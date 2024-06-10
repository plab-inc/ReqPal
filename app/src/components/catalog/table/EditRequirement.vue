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
      <v-card-title>
        {{ localEditedRequirement.reqId }}
      </v-card-title>
      <v-divider />
      <v-card-text>
        <v-row>
          <v-col cols="8">
            <v-text-field v-model="localEditedRequirement.title" label="Titel" variant="outlined" />
          </v-col>
          <v-col cols="4">
            <v-text-field v-model="localEditedRequirement.reqId" label="Requirement Id" variant="outlined" />
          </v-col>
        </v-row>
        <v-textarea v-model="localEditedRequirement.description" label="Beschreibung" variant="outlined" />
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
            <v-text-field variant="outlined" label="Kommentar" v-model="productDetail.comment" />
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
        <v-btn color="success" @click="save">Speichern</v-btn>
        <v-btn color="info" @click="close">Schließen</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import catalogService from "@/services/database/catalog.ts";
import { Requirement } from "@/types/catalog.ts";

const props = defineProps({
  dialog: Boolean,
  editedItem: Object
});

const localEditedRequirement = ref<Requirement>(JSON.parse(JSON.stringify(props.editedItem)));

const emit = defineEmits(["update:dialog"]);

function close() {
  emit("update:dialog", false);
}

function save() {
  if (!areRequirementEquals()) {
    console.log("Update Requirements");
    catalogService.push.updateRequirement(localEditedRequirement.value);
    Object.assign(props.editedItem as Requirement, localEditedRequirement.value);
  }

  if (!areProductsEquals()) {
    console.log("Update Product Requirements");
    for (const [key, productDetail] of Object.entries(localEditedRequirement.value.products)) {
      catalogService.push.updateProductDetailsForRequirement(key, productDetail, localEditedRequirement.value.requirement_id);
    }
    Object.assign(props.editedItem as Requirement, localEditedRequirement?.value);
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

watch(() => props.dialog, () => {
  localEditedRequirement.value = JSON.parse(JSON.stringify(props.editedItem));
}, { immediate: true });

</script>