<template>
  <v-data-table-virtual
      class="mt-5"
      v-model:expanded="expanded"
      :headers="headers"
      :items="productStore.getCurrentProducts ? productStore.getCurrentProducts : []"
      item-value="product_id"
      hover
      height="70vh"
      no-data-text="Sie haben noch keine Produkte erstellt."
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
            @click.stop="openEditDialog(item)"
        />
        <v-btn
            class="ml-2"
            density="compact"
            color="error"
            variant="plain"
            size="medium"
            icon="mdi-delete"
            @click.stop="deleteProduct(item)"
        />
      </div>
    </template>
  </v-data-table-virtual>
  <EditProduct v-if="editDialog" :dialog="editDialog" @update:dialog="updateEditDialog"></EditProduct>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { Product } from "@/types/catalog.ts";
import { useProductStore } from "@/stores/product.ts";
import { DeleteProduct } from "@/utils/dialogs.ts";
import { useUtilStore } from "@/stores/util.ts";
import EditProduct from "@/components/catalog/product/EditProduct.vue";

const productStore = useProductStore();
const expanded = ref<any>([]);
const utilStore = useUtilStore();
const editDialog = ref<boolean>(false);

const headers = [
  {title: "Name", value: "product_name", sortable: true, width: '47,5%'},
  {title: "Url", value: "product_url", sortable: true, width: '47,5%'},
  {title: "Aktionen", value: "actions", sortable: false, width: '5%'}
];

function openEditDialog(item: Product | null) {
  if (item) {
    productStore.currentProduct = item;
    editDialog.value = true;
  }
}

function updateEditDialog(value: boolean) {
  editDialog.value = value;
}

function deleteProduct(item: Product) {
  utilStore.openDialog(DeleteProduct, () => {
    productStore.deleteProduct(item.product_id);
  });
}
</script>