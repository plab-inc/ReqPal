<template>
  <v-dialog
      :model-value="dialog"
      @update:model-value="close"
      opacity="0.3"
      max-width="900"
  >
    <v-card variant="elevated" class="pa-1">
      <v-card-title>Produkte hinzufügen</v-card-title>
      <v-card-text>
        <v-row v-if="filteredProducts.length > 0">
          <v-col>
            <div class="mb-2">
              Produkte zum Katalog hinzufügen
            </div>
            <v-select
                v-model="selection"
                :items="filteredProducts"
                hint="Wähle Produkte aus"
                item-title="product_name"
                item-value="product_id"
                label="Select"
                multiple
                persistent-hint
            ></v-select>
          </v-col>
        </v-row>
        <v-row v-if="!showNewProductForm">
          <v-col>
            <div>
              <v-btn
                  class="ml-1"
                  density="compact"
                  color="success"
                  variant="plain"
                  size="medium"
                  icon="mdi-plus"
                  @click.stop="showNewProductForm = true"
              />
              Neues Produkt erstellen
            </div>
          </v-col>
        </v-row>
        <v-row v-if="showNewProductForm">
          <v-col>
            <v-form v-model="isFormValid" @submit.prevent="createNewProduct" ref="form">
              <div class="mb-2">
                <v-btn
                    class="ml-1"
                    density="compact"
                    color="success"
                    variant="plain"
                    size="medium"
                    icon="mdi-minus"
                    @click="showNewProductForm = false"
                />
                Neues Produkt erstellen
              </div>
              <v-text-field variant="outlined" label="Name" v-model="newProduct.product_name" required
                            :rules="[requiredStringRule]"/>
              <v-text-field variant="outlined" label="URL" v-model="newProduct.product_url" required
                            :rules="[requiredHyperlinkRule, requiredStringRule]"/>
              <v-btn
                  class="ml-1"
                  density="compact"
                  color="success"
                  variant="plain"
                  size="medium"
                  type="submit"
                  :disabled="!isFormValid"
              >Produkt erstellen
              </v-btn>
            </v-form>
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="success" @click="addProductsToCatalog">Auswahl hinzufügen</v-btn>
        <v-btn color="info" @click="close">Schließen</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { onBeforeMount, ref } from "vue";
import { Product } from "@/types/catalog.ts";
import { useCatalogStore } from "@/stores/catalog.ts";
import AlertService from "@/services/util/alert.ts";
import { requiredHyperlinkRule, requiredStringRule } from "@/utils/validationRules.ts";
import CatalogService from "@/services/database/catalog.ts";

interface Props {
  dialog: boolean;
  products: Product[];
}

const props = defineProps<Props>();
const emit = defineEmits(["update:dialog", "productsAdded"]);

const catalogStore = useCatalogStore();
const userProducts = ref<Product[]>([]);
const filteredProducts = ref<Product[]>([]);
const selection = ref<string[]>([]);

const showNewProductForm = ref<boolean>(false);
const isFormValid = ref<boolean>(false);
const newProduct = ref<any>({ product_name: "", product_url: "" });

function close() {
  emit("update:dialog", false);
}

async function addProductsToCatalog() {
  if (selection.value.length > 0) {
    for (const selectedId of selection.value) {
      const productToAdd = filteredProducts.value.find(product => product.product_id === selectedId);
      if (productToAdd) {
        await catalogStore.addProductToCatalogAndRequirements(productToAdd);
      }
    }
    emit("productsAdded");
    AlertService.addSuccessAlert("Produkte hinzugefügt.");
  } else {
    AlertService.addWarningAlert("Es wurden keine Produkte ausgewählt.");
  }
}

async function createNewProduct() {
  try {
    const data = await catalogStore.uploadProductFromUser(newProduct.value);
    if (data) {
      filteredProducts.value.push({...data})
      AlertService.addSuccessAlert("Produkt erstellt!");
    }
    newProduct.value = {product_name: "", product_url: ""};
    showNewProductForm.value = false;
  } catch (error: any) {
    AlertService.addErrorAlert("Produkt konnte nicht erstellt werden.")
  }
}

onBeforeMount(async () => {
  let data = await CatalogService.pull.fetchProductsByUser();
  if (data) userProducts.value = data;
  filteredProducts.value = userProducts.value.filter(userProduct => {
    return !props.products.some(propProduct => propProduct.product_id === userProduct.product_id);
  });
});
</script>