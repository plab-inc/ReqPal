<template>
  <div v-if="catalogStore.getCurrentCatalog">
    <v-row align="center" justify="space-between">
      <v-col cols="9">
        <v-row no-gutters>
          <v-col cols="6" class="mr-4">
            <EditCatalogName />
          </v-col>
          <v-col cols="5">
            <ProductSelection />
          </v-col>
        </v-row>
      </v-col>
      <v-col cols="auto">
        <v-btn
          variant="outlined"
          size="large"
          class="mb-5"
          @click="dialogStore.openEditDialog()"
        >
          Anforderung hinzufügen
        </v-btn>
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

const catalogStore = useCatalogStore();
const dialogStore = useDialogStore();
</script>