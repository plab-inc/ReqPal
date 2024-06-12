// stores/dialogStore.ts
import { defineStore } from "pinia";
import { ref } from "vue";
import { ProductDetail, Requirement } from "@/types/catalog.ts";
import { useCatalogStore } from "@/stores/catalog.ts";

const catalogStore = useCatalogStore();

export const useDialogStore = defineStore("dialogStore", () => {
  const editDialog = ref(false);
  const editedItem = ref<Requirement | null>(null);
  const isNew = ref(false);

  function openEditDialog(item: Requirement | null, newRequirement: boolean) {

    let products: { [product_id: string]: ProductDetail } = {};

    for (const product of catalogStore.getCurrentCatalog?.products || []) {
      products[product.product_id] = {
        product_name: product.product_name,
        qualification: 0,
        comment: product.product_name + "-Qualifizierungs-Kommentar"
      };
    }

    editedItem.value = newRequirement ? { label: "", title: "", description: "", products: products } : item;
    isNew.value = newRequirement;
    editDialog.value = true;
  }

  function closeDialog() {
    editDialog.value = false;
  }

  return {
    editDialog,
    editedItem,
    isNew,
    openEditDialog,
    closeDialog
  };
});
