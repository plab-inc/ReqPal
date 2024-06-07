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
        Edit Requirement: {{ localEditedRequirement.reqId }}
      </v-card-title>
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
        <v-row>
          <v-col
            :cols="(Object.keys(localEditedRequirement.products).indexOf(key.toString()) % 3 === 2 ? 12 : 6)"
            v-for="(productDetail, key) in localEditedRequirement.products"
            :key="key"
          >
            <div class="text-caption mb-2">
              {{ key }}
            </div>
            <v-text-field variant="outlined" label="Kommentar" v-model="productDetail.comment" />
            <v-slider
              color="warning"
              hint="Qualifizierung"
              v-model="productDetail.qualification"
              :max="5"
              :min="0"
              :step="1"
              rounded
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
import { ref, toRaw, watch } from "vue";
import catalogService from "@/services/database/catalog.ts";
import { Requirement } from "@/types/catalog.ts";

const props = defineProps({
  dialog: Boolean,
  editedItem: Object
});

const localEditedRequirement = ref<any>({ ...toRaw(props.editedItem) });

const emit = defineEmits(["update:dialog"]);

function close() {
  emit("update:dialog", false);
}

function save() {

  if (JSON.stringify(toRaw(props.editedItem)) !== JSON.stringify(toRaw(localEditedRequirement.value))) {
    console.log("Update Requirements");
    catalogService.push.updateRequirement(localEditedRequirement.value as Requirement);
    Object.assign(props.editedItem as Requirement, localEditedRequirement.value as Requirement);
  }

  close();
}

watch(() => props.editedItem, (newVal) => {
  localEditedRequirement.value = { ...newVal };
}, { immediate: true });

</script>