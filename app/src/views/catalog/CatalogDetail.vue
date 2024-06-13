<template>
  <div v-if="catalogStore.getCurrentCatalog">
    <v-row justify="space-between">
      <v-col cols="5">
        <v-row no-gutters>
          <v-col>
            <EditCatalogName />
            <ProductSelection />
          </v-col>
        </v-row>
      </v-col>
      <v-col cols="auto" class="mb-4">
        <v-btn-group
          variant="outlined"
          elevation="5"
          divided
        >
          <v-btn
            color="success"
            :disabled="!userCanEdit"
            @click="dialogStore.openEditDialog()"
          >
            Anforderung hinzufügen
          </v-btn>
          <v-btn
            color="error"
            :disabled="!userCanEdit || catalogStore.getCurrentCatalogSelectedIds.length <= 0"
            @click="deleteRequirements()"
          >
            Gewählte Anforderungen löschen
          </v-btn>
        </v-btn-group>
      </v-col>
    </v-row>
    <v-divider />
    <v-container>
      <v-row>
        <CatalogTable />
      </v-row>
    </v-container>
  </div>
  <div v-else>
    <v-skeleton-loader type="article" />
  </div>
</template>

<script setup lang="ts">
import { useCatalogStore } from "@/stores/catalog.ts";
import CatalogTable from "@/components/catalog/tables/CatalogTable.vue";
import ProductSelection from "@/components/catalog/product/ProductSelection.vue";
import { useDialogStore } from "@/stores/dialog.ts";
import EditCatalogName from "@/components/catalog/EditCatlogName.vue";
import { onBeforeMount, ref } from "vue";
import { useAuthStore } from "@/stores/auth.ts";
import { DeleteRequirement } from "@/utils/dialogs.ts";
import { useUtilStore } from "@/stores/util.ts";

const catalogStore = useCatalogStore();
const utilStore = useUtilStore();
const dialogStore = useDialogStore();
const authStore = useAuthStore();

const userCanEdit = ref<boolean>(false);

function deleteRequirements() {
  utilStore.openDialog(DeleteRequirement, () => {
    catalogStore.deleteSelectedRequirements();
  });
}

onBeforeMount(async () => {
  if (catalogStore.currentCatalog?.user_id === authStore.user?.id || authStore.isModerator) {
    userCanEdit.value = true;
  }
});
</script>