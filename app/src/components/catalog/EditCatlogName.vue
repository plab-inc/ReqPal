<template>
  <v-form ref="form" v-model="formValid">
    <v-text-field
      label="Katalogname"
      hide-details
      density="comfortable"
      v-model="editedCatalogName"
      :rules="[catalogNameUniqueRule, requiredStringRule]"
      type="text"
      :readonly="!userOwnsCatalog"
      variant="outlined"
    >
      <template v-if="hasChanged()" v-slot:append>
        <v-btn
          density="compact"
          color="success"
          variant="plain"
          size="medium"
          icon="mdi-content-save"
          @click="saveCatalogName()"
        />
      </template>
    </v-text-field>
  </v-form>
</template>

<script setup lang="ts">
import { onBeforeMount, ref, watch } from "vue";
import { useCatalogStore } from "@/stores/catalog.ts";
import CatalogService from "@/services/database/catalog.ts";
import { requiredStringRule } from "@/utils/validationRules.ts";
import { useAuthStore } from "@/stores/auth.ts";
import AlertService from "@/services/util/alert.ts";

const catalogStore = useCatalogStore();
const authStore = useAuthStore();
const catalogService = CatalogService;
const isEditing = ref(true);
const editedCatalogName = ref("");
const originalCatalogName = ref("");
const userOwnsCatalog = ref(false);
const formValid = ref(false);
const form = ref();

const toggleEdit = () => {
  isEditing.value = !isEditing.value;
};

const saveCatalogName = async () => {
  if (catalogStore.getCurrentCatalog && form.value && (await form.value.validate())) {
    const data = await catalogService.push.updateCatalogName(catalogStore.getCurrentCatalog.catalog_id, editedCatalogName.value.trimStart().trimEnd());

    if (data && data.length > 0) {
      originalCatalogName.value = editedCatalogName.value;
      AlertService.addSuccessAlert("Name vom Katalog aktualisiert.");
      toggleEdit();
    }
  }
};

const hasChanged = () => {
  return editedCatalogName.value !== originalCatalogName.value;
};

const catalogNameUniqueRule = (value: string) => {

  const trimmedValue = value.trimStart().trimEnd();

  if (trimmedValue === originalCatalogName.value) {
    return true;
  }

  if (catalogStore.getCustomCatalogs.find(catalog => catalog.catalog_name === trimmedValue)) {
    return "Dieser Katalog Name wird bereits verwendet";
  }

  return true;

};

onBeforeMount(async () => {
  originalCatalogName.value = catalogStore.currentCatalog?.catalog_name || "";
  editedCatalogName.value = originalCatalogName.value;

  if (catalogStore.currentCatalog?.user_id === authStore.user?.id || authStore.isModerator) {
    userOwnsCatalog.value = true;
  }
});

watch(editedCatalogName, (newVal, oldVal) => {
  if (newVal !== oldVal) {
    isEditing.value = true;
  }
});

</script>