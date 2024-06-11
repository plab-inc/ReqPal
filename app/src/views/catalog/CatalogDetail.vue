<script setup lang="ts">
import { ref, watch } from 'vue';
import { useCatalogStore } from "@/stores/catalog.ts";
import { onBeforeMount } from "vue";
import { useRoute } from "vue-router";
import CatalogTable from "@/components/catalog/table/CatalogTable.vue";
import CatalogService from "@/services/database/catalog.ts";

const catalogStore = useCatalogStore();
const catalogService = CatalogService;
const isEditing = ref(true);
const editedCatalogName = ref('');
const originalCatalogName = ref('');

const toggleEdit = () => {
  isEditing.value = !isEditing.value;
};

const saveCatalogName = async () => {
  if(catalogStore.getCurrentCatalog) {
    const data = await catalogService.push.updateCatalogName(catalogStore.getCurrentCatalog.catalog_id, editedCatalogName.value);

    if(data && data.length > 0) {
      originalCatalogName.value = editedCatalogName.value;
      toggleEdit()
    }

  }
};

const hasChanged = () => {
  return editedCatalogName.value !== originalCatalogName.value;
};

onBeforeMount(async () => {
  originalCatalogName.value = catalogStore.currentCatalog?.catalog_name || '';
  editedCatalogName.value = originalCatalogName.value;
});

watch(editedCatalogName, (newVal, oldVal) => {
  if (newVal !== oldVal) {
    isEditing.value = true;
  }
});
</script>

<template>
  <div v-if="catalogStore.getCurrentCatalog">
    <v-row justify="start" align="center">
      <v-col cols="auto" class="text-h4">
        <v-text-field
          width="65vh"
          v-model="editedCatalogName"
          :append-icon="hasChanged() ? 'mdi-content-save' : 'dummy'"
          type="text"
          variant="solo-filled"
          @click:append="hasChanged() ? saveCatalogName() : toggleEdit()"
        />
      </v-col>
    </v-row>
    <v-divider />
    <v-container class="mt-2">
      <v-row>
        <v-col>
          <CatalogTable />
        </v-col>
      </v-row>
    </v-container>
  </div>
  <div v-else>
    <v-skeleton-loader type="article"></v-skeleton-loader>
  </div>
</template>