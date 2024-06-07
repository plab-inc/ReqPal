<template>
  <v-dialog
    :model-value="dialog"
    @update:model-value="close"
    opacity="0.3"
    max-width="900"
  >
    <v-sheet>
      <v-card
        variant="outlined"
        density="compact"
      >
        <v-card-title>
          Edit Requirement: {{ localEditedItem.reqId }}
        </v-card-title>
        <v-card-text>
          <v-text-field v-model="localEditedItem.title" label="Titel" variant="outlined" />
          <v-text-field v-model="localEditedItem.reqId" label="Requirement Id" variant="outlined" />
          <v-textarea v-model="localEditedItem.description" label="Beschreibung" variant="outlined" />
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" @click="save">Speichern</v-btn>
          <v-btn color="primary" @click="close">Schließen</v-btn>
        </v-card-actions>
      </v-card>
    </v-sheet>
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

const localEditedItem = ref<any>({ ...props.editedItem });

const emit = defineEmits(["update:dialog"]);

function close() {
  emit("update:dialog", false);
}

function save() {

  if (JSON.stringify(toRaw(props.editedItem)) !== JSON.stringify(toRaw(localEditedItem.value))) {
    console.log("Update Requirements");
    catalogService.push.updateRequirement(localEditedItem.value as Requirement);
    Object.assign(props.editedItem as Requirement, localEditedItem.value as Requirement);
  }
  close();
}

watch(() => props.editedItem, (newVal) => {
  localEditedItem.value = { ...newVal };
}, { immediate: true });

</script>
