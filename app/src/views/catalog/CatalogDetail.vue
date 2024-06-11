<script setup lang="ts">
import { ref, watch } from 'vue';
import { useCatalogStore } from "@/stores/catalog.ts";
import { onBeforeMount } from "vue";
import { useRoute } from "vue-router";
import CatalogTable from "@/components/catalog/table/CatalogTable.vue";
import CatalogService from "@/services/database/catalog.ts";
import { useAuthStore } from "@/stores/auth.ts";
import { requiredStringRule } from "@/utils/validationRules.ts";

const catalogStore = useCatalogStore();
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

  if(catalogStore.getCustomCatalogs.find(catalog => catalog.catalog_name === trimmedValue.trimStart().trimEnd())){
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
    <v-row justify="start" align="center">
      <v-col cols="auto" class="text-h4">
        <v-form ref="form" v-model="formValid">
          <v-text-field
            min-width="35rem"
            v-model="editedCatalogName"
            :rules="[catalogNameUniqueRule, requiredStringRule]"
            :append-icon="hasChanged() ? 'mdi-content-save' : 'dummy'"
            color="success"
            type="text"
            :readonly="!userOwnsCatalog"
            variant="outlined"
            @click:append="hasChanged() ? saveCatalogName() : toggleEdit()"
          >
          </v-text-field>
        </v-form>
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