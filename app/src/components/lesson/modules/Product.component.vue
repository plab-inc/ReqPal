<script setup lang="ts">
import ProductItem from "@/components/catalog/product/ProductItem.component.vue";
import {useLessonFormStore} from "@/stores/lessonForm.store.ts";
import {ref} from "vue";
import Help from "@/components/lesson/modules/Help.component.vue";

interface Props {
  componentId: string,
}

const props = defineProps<Props>();

const lessonFormStore = useLessonFormStore();

const fields = ref<any>({
  options: lessonFormStore.getComponentFieldValues(props.componentId, 'options'),
});
</script>

<template>
  <v-expansion-panels>
    <v-expansion-panel elevation="0">
      <v-expansion-panel-title>
        Produkte
      </v-expansion-panel-title>
      <v-expansion-panel-text>
        <v-container>
          <v-row>
            <v-col class="d-flex justify-end">
              <Help dialog-type="productExplanation"></Help>
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <v-row>
                <v-col v-for="product in fields.options" :key="product.product_name" :cols="12/fields.options.length">
                  <ProductItem :options="product"></ProductItem>
                </v-col>
              </v-row>
            </v-col>
          </v-row>
        </v-container>
      </v-expansion-panel-text>
    </v-expansion-panel>
  </v-expansion-panels>
</template>

<style scoped>

</style>
