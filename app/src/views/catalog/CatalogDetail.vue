<script setup lang="ts">
import { onBeforeMount, ref, watch } from "vue";
import { useCatalogStore } from "@/stores/catalog.ts";
import CatalogTable from "@/components/catalog/table/catalogTable/CatalogTable.vue";
import CatalogService from "@/services/database/catalog.ts";
import { useAuthStore } from "@/stores/auth.ts";
import { requiredStringRule } from "@/utils/validationRules.ts";
import ProductSelection from "@/components/catalog/table/catalogTable/ProductSelection.vue";
import { useDialogStore } from "@/stores/dialog.ts";

const catalogStore = useCatalogStore();
const dialogStore = useDialogStore();
const authStore = useAuthStore();
const catalogService = CatalogService;
const isEditing = ref(true);
const editedCatalogName = ref('');
const originalCatalogName = ref('');
const userOwnsCatalog = ref(false);
const formValid = ref(false);
const form = ref();

const toggleEdit = () => {
  isEditing.value = !isEditing.value;
};

const saveCatalogName = async () => {
  if(catalogStore.getCurrentCatalog && form.value && (await form.value.validate())) {
    const data = await catalogService.push.updateCatalogName(catalogStore.getCurrentCatalog.catalog_id, editedCatalogName.value.trimStart().trimEnd());

    if(data && data.length > 0) {
      originalCatalogName.value = editedCatalogName.value;
      toggleEdit()
    }
  }
};

const hasChanged = () => {
  return editedCatalogName.value !== originalCatalogName.value;
};

const catalogNameUniqueRule = (value: string) => {

  const trimmedValue = value.trimStart().trimEnd();

  if(trimmedValue === originalCatalogName.value) {
    return true;
  }

  if(catalogStore.getCustomCatalogs.find(catalog => catalog.catalog_name === trimmedValue)){
    return 'Dieser Katalog Name wird bereits verwendet';
  }

  return true;

}

onBeforeMount(async () => {
  originalCatalogName.value = catalogStore.currentCatalog?.catalog_name || '';
  editedCatalogName.value = originalCatalogName.value;

  if(catalogStore.currentCatalog?.user_id === authStore.user?.id || authStore.isModerator) {
    userOwnsCatalog.value = true;
  }
});

watch(editedCatalogName, (newVal, oldVal) => {
  if (newVal !== oldVal) {
    isEditing.value = true;
  }
});

</script>

<template>
  <div v-if="catalogStore.getCurrentCatalog">
    <v-row align="center" justify="space-between" no-gutters>
      <v-col cols="4">
        <v-form ref="form" v-model="formValid">
          <v-text-field
            label="Katalogname"
            hide-details
            density="comfortable"
            v-model="editedCatalogName"
            :rules="[catalogNameUniqueRule, requiredStringRule]"
            :append-icon="hasChanged() ? 'mdi-content-save' : 'dummy'"
            type="text"
            :readonly="!userOwnsCatalog"
            variant="outlined"
            @click:append="hasChanged() ? saveCatalogName() : toggleEdit()"
          >
          </v-text-field>
        </v-form>
      </v-col>
      <v-col cols="3">
        <ProductSelection />
      </v-col>
      <v-spacer />
      <v-col cols="auto">
        <v-btn
          variant="outlined"
          size="large"
          color="primary"
          @click="dialogStore.openEditDialog(null, true)"
        >
          Anforderung hinzufügen
        </v-btn>
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