<template>
  <v-dialog
      :model-value="dialog"
      @update:model-value="close"
      opacity="0.3"
      max-width="900"
  >
    <v-card variant="elevated" class="pa-1">
      <v-card-title>Produkte bearbeiten</v-card-title>
      <v-card-text>
        <v-row>
          <v-col
              :cols="localProducts.length % 3 === 2 ? 12 : 6"
              v-for="(product, index) in localProducts"
              :key="product.product_id"
          >
            <div class="text-caption mb-2">
              {{ product.product_name }}
            </div>
            <v-text-field variant="outlined" label="Name" v-model="localProducts[index].product_name"
                          :rules="[requiredStringRule]"/>
            <v-text-field variant="outlined" label="URL" v-model="localProducts[index].product_url"
                          :rules="[requiredHyperlinkRule, requiredStringRule]"/>
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="success" @click="save">Speichern</v-btn>
        <v-btn color="info" @click="close">Schließen</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import {onBeforeMount, ref, watch} from "vue";
import {Product} from "@/types/catalog.ts";
import {useCatalogStore} from "@/stores/catalog.ts";
import AlertService from "@/services/util/alert.ts";
import {requiredHyperlinkRule, requiredStringRule} from "@/utils/validationRules.ts";

interface Props {
  dialog: boolean;
  products: Product[];
}

const props = defineProps<Props>();
const emit = defineEmits(["update:dialog"]);

const catalogStore = useCatalogStore();
const localProducts = ref<Product[]>([]);
const originalProducts = ref<Product[]>([]);
const changedProducts = ref<Product[]>([]);

function close() {
  emit("update:dialog", false);
}

async function save() {
  try {
    if (changedProducts.value.length <= 0) {
      AlertService.addInfoAlert("Es wurden keine Änderungen vorgenommen.");
      return;
    }

    for (const newProduct of changedProducts.value) {
      const toCompare = originalProducts.value.find(p => p.product_id === newProduct.product_id);
      if (toCompare && !areProductsEqual(toCompare, newProduct)) {
        await catalogStore.updateProductForCurrentCatalog(newProduct);
      }
    }

    // dadurch werden Änderungen direkt angezeigt
    props.products.length = 0;
    props.products.push(...JSON.parse(JSON.stringify(localProducts.value)));

    // Änderungen als neue Richtlinie nutzen
    originalProducts.value = JSON.parse(JSON.stringify(localProducts.value));
    changedProducts.value = [];

    AlertService.addSuccessAlert("Produkte gespeichert.");
  } catch (error: any) {
    AlertService.addErrorAlert(error);
  }
}

function areProductsEqual(original: Product, edited: Product) {
  return JSON.stringify(original) === JSON.stringify(edited);
}

onBeforeMount(async () => {
  if (catalogStore.getCurrentCatalog) {
    const originalCatalogProducts = catalogStore.getCurrentCatalog?.products;
    localProducts.value = JSON.parse(JSON.stringify(originalCatalogProducts));
    originalProducts.value = JSON.parse(JSON.stringify(originalCatalogProducts));
  }
});

watch(
    localProducts,
    (newVal) => {
      changedProducts.value = newVal.filter((product, index) => {
        return !areProductsEqual(originalProducts.value[index], product);
      });
    },
    {deep: true}
);
</script>
