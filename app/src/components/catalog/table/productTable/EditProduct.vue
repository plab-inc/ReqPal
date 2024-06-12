<template>
  <v-dialog
      :model-value="dialog"
      @update:model-value="close"
      opacity="0.3"
      max-width="900"
  >
    <v-form v-model="isFormValid" @submit.prevent="save" ref="form">
      <v-card variant="elevated" class="pa-1">
        <v-card-title v-if="localProduct.product_id.length > 0">Produkt bearbeiten</v-card-title>
        <v-card-title v-if="localProduct.product_id.length <= 0">Produkt erstellen</v-card-title>
        <v-card-text>
          <v-row>
            <v-col>
              <div class="text-caption mb-2">
                Produkt
              </div>
              <v-text-field variant="outlined" label="Name" v-model="localProduct.product_name"
                            :rules="[requiredStringRule, productNameUniqueRule]"/>
              <v-text-field variant="outlined" label="URL" v-model="localProduct.product_url"
                            :rules="[requiredHyperlinkRule, requiredStringRule]"/>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="success" type="submit"
                 :disabled="!isFormValid">Speichern
          </v-btn>
          <v-btn color="info" @click="close">Schließen</v-btn>
        </v-card-actions>
      </v-card>
    </v-form>
  </v-dialog>
</template>

<script setup lang="ts">
import {onBeforeMount, ref} from "vue";
import {Product} from "@/types/catalog.ts";
import AlertService from "@/services/util/alert.ts";
import {requiredHyperlinkRule, requiredStringRule} from "@/utils/validationRules.ts";
import {useProductStore} from "@/stores/product.ts";

interface Props {
  dialog: boolean;
}

const props = defineProps<Props>();
const emit = defineEmits(["update:dialog"]);
const productStore = useProductStore();
const isFormValid = ref<boolean>(false);
const localProduct = ref<Product>({product_id: "", product_name: "", product_url: ""});
const originalProduct = ref<Product>();

function close() {
  emit("update:dialog", false);
}

const productNameUniqueRule = (value: string) => {
  const trimmedValue = value.trimStart().trimEnd().toLowerCase();

  if(originalProduct.value && trimmedValue === originalProduct.value.product_name.toLowerCase()) {
    return true;
  }

  if(productStore.getCurrentProducts.find(product => product.product_name.toLowerCase() === trimmedValue)){
    return 'Der Name dieses Produkts wird bereits verwendet';
  }

  return true;
}

async function save() {
  if (originalProduct.value && localProduct.value) {
    if (!areProductsEqual(originalProduct.value, localProduct.value)) {
      await updateProduct();
    } else {
      AlertService.addInfoAlert("Es wurden keine Änderungen vorgenommen.")
      return;
    }
  } else if (!originalProduct.value && localProduct.value) {
    await createProduct();
  }

  emit("update:dialog", false);
}

async function updateProduct() {
  try {
    await productStore.updateCurrentProduct(localProduct.value);
    AlertService.addSuccessAlert("Produkt wurde aktualisiert.")
  } catch (error: any) {
    throw error;
  }
}

async function createProduct() {
  try {
    await productStore.uploadProductFromUser(localProduct.value);
    AlertService.addSuccessAlert("Produkt wurde erstellt.")
  } catch (error: any) {
    throw error;
  }
}

function areProductsEqual(original: Product, edited: Product) {
  return JSON.stringify(original) === JSON.stringify(edited);
}

onBeforeMount(async () => {
  if (productStore.getCurrentProduct) {
    originalProduct.value = productStore.getCurrentProduct;
    localProduct.value = JSON.parse(JSON.stringify(originalProduct.value));
  }
});
</script>
