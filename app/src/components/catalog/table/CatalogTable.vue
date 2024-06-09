<template>
  <ProductPanel class="mb-5"></ProductPanel>
  <v-data-table
    v-model:expanded="expanded"
    :headers="headers"
    :items="catalogStore.getCurrentCatalog?.requirements"
    item-value="requirement_id"
    show-expand
    expand-on-click
    hover
    items-per-page="15"
  >
    <template v-slot:item.actions="{ item }">
      <div style="display: flex; align-items: center;">
        <v-btn
          class="ml-1"
          density="compact"
          color="success"
          variant="plain"
          size="medium"
          icon="mdi-pencil"
          @click.stop="openEditDialog(item)"
        />
        <v-btn
          class="ml-2"
          density="compact"
          color="error"
          variant="plain"
          size="medium"
          icon="mdi-delete"
          @click.stop="deleteRequirement(item)"
        />
      </div>
    </template>
    <template v-if="catalogStore.getCurrentCatalog" v-slot:expanded-row="{ columns, item }">
      <tr>
        <td :colspan="columns.length">
          <ProductDetailPanel :requirement="item" :products="catalogStore.getCurrentCatalog?.products"></ProductDetailPanel>
        </td>
      </tr>
    </template>
  </v-data-table>
  <EditRequirement :dialog="editDialog" :editedItem="editedItem" @update:dialog="updateDialog"/>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { Requirement } from "@/types/catalog.ts";
import ProductDetailPanel from "@/components/catalog/product/productDetails/ProductDetailPanel.vue";
import ProductPanel from "@/components/catalog/product/ProductPanel.vue";
import EditRequirement from "@/components/catalog/table/EditRequirement.vue";
import { useCatalogStore } from "@/stores/catalog.ts";
import { useUtilStore } from "@/stores/util.ts";
import { DeleteRequirement } from "@/utils/dialogs.ts";

const catalogStore = useCatalogStore();
const utilStore = useUtilStore();
const expanded = ref<any>([]);
const editDialog = ref(false);
const editedItem = ref<any | null>(null);

const headers = [
  { title: 'Anforderung', value: 'reqId', sortable: true },
  { title: 'Titel', value: 'title', sortable: true },
  { title: 'Beschreibung', value: 'description', sortable: true },
  { title: 'Aktionen', key: 'actions', sortable: false },
];

function openEditDialog(item: Requirement) {
  editedItem.value = item;
  editDialog.value = true;
}

function deleteRequirement(item: Requirement) {
  utilStore.openDialog(DeleteRequirement, () => {
    catalogStore.deleteRequirement(item.requirement_id);
  });
}

function updateDialog(value: boolean) {
  editDialog.value = value;
}
</script>
