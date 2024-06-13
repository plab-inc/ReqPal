<template>
  <v-data-table-virtual
    v-model:expanded="expanded"
    :headers="headers"
    :items="catalogStore.getCurrentCatalog?.requirements"
    item-value="requirement_id"
    show-expand
    expand-on-click
    hover
    height="75vh"
    no-data-text="Dieser Katalog enthält noch keine Anforderungen"
  >
    <template v-slot:item.actions="{ item }">
      <div>
        <v-btn
          class="ml-1"
          density="compact"
          color="success"
          variant="plain"
          size="medium"
          icon="mdi-pencil"
          @click.stop="dialogStore.openEditDialog(item)"
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
          <ProductDetailPanel :requirement="item"
                              :products="catalogStore.getCurrentCatalog?.products"></ProductDetailPanel>
        </td>
      </tr>
    </template>
  </v-data-table-virtual>
  <EditRequirement :dialog="dialogStore.editDialog" :editedItem="dialogStore.editedItem" :isNew="dialogStore.isNew"
                   @update:dialog="dialogStore.closeDialog" />
</template>
<script setup lang="ts">
import { onBeforeMount, ref } from "vue";
import { useCatalogStore } from "@/stores/catalog.ts";
import { useAuthStore } from "@/stores/auth.ts";
import { useUtilStore } from "@/stores/util.ts";
import { useDialogStore } from "@/stores/dialog.ts";
import ProductDetailPanel from "@/components/catalog/product/ProductDetailPanel.vue";
import EditRequirement from "@/components/catalog/requirement/EditRequirement.vue";
import { Requirement } from "@/types/catalog.ts";
import { DeleteRequirement } from "@/utils/dialogs.ts";

const catalogStore = useCatalogStore();
const authStore = useAuthStore();
const utilStore = useUtilStore();
const dialogStore = useDialogStore();
const expanded = ref<any>([]);
const userOwnsCatalog = ref(false);

const headers = ref<any>([
  { title: "Anforderung", value: "label", sortable: true, align: "start" },
  { title: "Titel", value: "title", sortable: true, align: "start" },
  { title: "Beschreibung", value: "description", sortable: true, align: "center" }
]);

onBeforeMount(() => {
  if (catalogStore.currentCatalog?.user_id === authStore.user?.id || authStore.isModerator) {
    userOwnsCatalog.value = true;
    headers.value = [
      ...headers.value,
      { title: "Aktionen", value: "actions", sortable: false, align: "end" }
    ];
  }
});

function deleteRequirement(item: Requirement) {
  utilStore.openDialog(DeleteRequirement, () => {
    catalogStore.deleteRequirement(item.requirement_id);
  });
}
</script>
