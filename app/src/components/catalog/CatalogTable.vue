<script setup lang="ts">
import {Product, Requirement} from "@/types/catalog.ts";
import {ref} from "vue";
import ProductPanel from "@/components/catalog/product/ProductPanel.vue";

interface Props {
  requirementItems: Requirement[],
  loading: boolean,
  products: Product[]
}

const props = defineProps<Props>();
const expanded = ref<any>([]);

const headers = [
  {title: 'Anforderung', value: 'reqId', sortable: true},
  {title: 'Titel', value: 'title', sortable: true},
  {title: 'Beschreibung', value: 'description', sortable: true},
]
</script>

<template>
  <v-data-table
      v-model:expanded="expanded"
      :headers="headers"
      :items="requirementItems"
      item-value="requirement_id"
      show-expand
      expand-on-click
      hover
      items-per-page="15"
  >
    <template v-slot:expanded-row="{ columns, item }">
      <tr>
        <td :colspan="columns.length">
          <ProductPanel :requirement="item" :products="products"></ProductPanel>
        </td>
      </tr>
    </template>
  </v-data-table>
</template>