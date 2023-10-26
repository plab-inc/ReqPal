<script setup lang="ts">
import ProductItem from "@/components/catalog/product/ProductItem.component.vue";
import {ref} from "vue";
import Help from "@/components/lesson/modules/Help.component.vue";
import {useLessonStore} from "@/stores/lesson.store.ts";

interface Props {
  componentId: string,
}

const props = defineProps<Props>();

const lessonStore = useLessonStore();

const fields = ref<any>({
  options: lessonStore.getComponentFieldValues(props.componentId, 'options'),
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
                <v-col v-for="product in fields.options" :key="product.product_name" :md="12/fields.options.length">
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
