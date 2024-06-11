<template>
  <ProductPanel class="mb-5"></ProductPanel>
  <v-data-table-virtual
    v-model:expanded="expanded"
    :headers="headers"
    :items="catalogStore.getCurrentCatalog?.requirements"
    item-value="requirement_id"
    show-expand
    expand-on-click
    hover
    height="70vh"
    no-data-text="Dieser Katalog enthält noch keine Anforderungen"
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
          @click.stop="openEditDialog(item, false)"
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
    <template v-slot:top v-if="userOwnsCatalog">
      <v-btn
        class="mb-4"
        color="primary"
        max-width="20rem"
        @click="openNewRequirementDialog"
      >
        Anforderung hinzufügen
      </v-btn>
    </template>
  </v-data-table-virtual>
  <EditRequirement :dialog="editDialog" :editedItem="editedItem" :isNew="isNew" @update:dialog="updateDialog" />
</template>

<script setup lang="ts">
import { onBeforeMount, onMounted, ref } from "vue";
import { ProductDetail, Requirement } from "@/types/catalog.ts";
import ProductDetailPanel from "@/components/catalog/product/productDetails/ProductDetailPanel.vue";
import ProductPanel from "@/components/catalog/product/ProductPanel.vue";
import EditRequirement from "@/components/catalog/table/EditRequirement.vue";
import { useCatalogStore } from "@/stores/catalog.ts";
import { useUtilStore } from "@/stores/util.ts";
import { DeleteRequirement } from "@/utils/dialogs.ts";
import { useAuthStore } from "@/stores/auth.ts";

const catalogStore = useCatalogStore();
const authStore = useAuthStore();
const utilStore = useUtilStore();
const expanded = ref<any>([]);
const editDialog = ref(false);
const editedItem = ref<any | null>(null);
const isNew = ref(false);
const userOwnsCatalog = ref(false);

const headers = [
  { title: "Anforderung", value: "label", sortable: true },
  { title: "Titel", value: "title", sortable: true },
  { title: "Beschreibung", value: "description", sortable: true }
];

onBeforeMount(() => {
  if(catalogStore.currentCatalog?.user_id === authStore.user?.id || authStore.isModerator) {
    userOwnsCatalog.value = true;
    headers.push(
      { title: "Aktionen", value: "actions", sortable: false }
    )
  }
})

function openEditDialog(item: Requirement | null, newRequirement: boolean) {
  if (newRequirement) {
    let products: { [product_id: string]: ProductDetail } = {};

    for (const product of catalogStore.getCurrentCatalog?.products || []) {
      products[product.product_id] = {
        product_name: product.product_name,
        qualification: 0,
        comment: product.product_name + "-Qualifizierungs-Kommentar"
      };
    }

    editedItem.value = { label: "", title: "", description: "", products: products };
    isNew.value = true;
  }
  if (!newRequirement) {
    editedItem.value = item;
    isNew.value = false;
  }
  editDialog.value = true;
}

function openNewRequirementDialog() {
  openEditDialog(null, true);
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