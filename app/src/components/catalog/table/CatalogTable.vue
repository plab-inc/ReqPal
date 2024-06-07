<template>
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
      <v-icon
        size="small"
        icon="mdi-pencil"
        @click.stop="openEditDialog(item)"
      />
    </template>

    <template v-if="catalogStore.getCurrentCatalog" v-slot:expanded-row="{ columns, item }">
      <tr>
        <td :colspan="columns.length">
          <ProductPanel :requirement="item" :products="catalogStore.getCurrentCatalog?.products"></ProductPanel>
        </td>
      </tr>
    </template>
  </v-data-table>
  <EditRequirement :dialog="editDialog" :editedItem="editedItem" @update:dialog="updateDialog"/>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { Requirement } from "@/types/catalog.ts";
import ProductPanel from "@/components/catalog/product/ProductPanel.vue";
import EditRequirement from "@/components/catalog/table/EditRequirement.vue";
import { useCatalogStore } from "@/stores/catalog.ts";

const catalogStore = useCatalogStore();
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

function updateDialog(value: boolean) {
  editDialog.value = value;
}
</script>
