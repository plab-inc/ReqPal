<script setup lang="ts">
import {Requirement} from "@/types/catalog.ts";
import { computed } from "vue";

// EasyDataTable with MIT Licence (LICENCE.txt) from: https://github.com/HC200ok/vue3-easy-data-table

interface Props {
  selectable: boolean,
  modelValue: Requirement[],
  requirementItems: Requirement[],
  loading: boolean
}

const props = defineProps<Props>();

const headers = [
  {text: 'Requirement', value: 'reqId', sortable: true},
  {text: 'Titel', value: 'title', sortable: true},
  {text: 'Beschreibung', value: 'description', sortable: true},
]

const emit = defineEmits(['onRowClick', 'update:modelValue'])

async function onRowClick(item: Requirement) {
  emit('onRowClick', item)
}

const selectedItems = computed({
  get() {
    return props.modelValue;
  },
  set(newValue) {
    emit('update:modelValue', newValue);
  }
})

</script>

<template>
  <EasyDataTable v-if="selectable"
                 :headers="headers"
                 :items="requirementItems"
                 :loading="loading"
                 :rows-items="[5, 10, 15, 25, 50]"
                 :rows-per-page="10"
                 v-model:items-selected="selectedItems"
                 table-class-name="customize-table"
                 @click-row="onRowClick">
  </EasyDataTable>

  <EasyDataTable v-if="!selectable"
                 :headers="headers"
                 :items="requirementItems"
                 :loading="loading"
                 :rows-items="[5, 10, 15, 25, 50]"
                 :rows-per-page="10"
                 table-class-name="customize-table"
                 @click-row="onRowClick">
  </EasyDataTable>
</template>

<style scoped>

.customize-table {
  --easy-table-border: 1px solid rgb(var(--v-theme-primary));
  --easy-table-row-border: 1px solid rgb(var(--v-theme-primary));

  --easy-table-header-font-size: 14px;
  --easy-table-header-height: 50px;
  --easy-table-header-font-color: white;
  --easy-table-header-background-color: rgb(var(--v-theme-primary));

  --easy-table-header-item-padding: 10px 15px;

  --easy-table-body-even-row-font-color: #fff;
  --easy-table-body-even-row-background-color: #4c5d7a;

  --easy-table-body-row-font-color: rgb(var(--v-theme-textColor));
  --easy-table-body-row-background-color: rgb(var(--v-theme-background));
  --easy-table-body-row-height: 50px;
  --easy-table-body-row-font-size: 14px;

  --easy-table-body-row-hover-font-color: #2d3a4f;
  --easy-table-body-row-hover-background-color: rgb(var(--v-theme-highlightColor));

  --easy-table-body-item-padding: 10px 15px;

  --easy-table-footer-background-color: rgb(var(--v-theme-primary));
  --easy-table-footer-font-color: white;
  --easy-table-footer-font-size: 14px;
  --easy-table-footer-padding: 0px 10px;
  --easy-table-footer-height: 50px;

  --easy-table-rows-per-page-selector-width: 70px;
  --easy-table-rows-per-page-selector-option-padding: 10px;
  --easy-table-rows-per-page-selector-z-index: 1;

  --easy-table-scrollbar-track-color: #2d3a4f;
  --easy-table-scrollbar-color: #2d3a4f;
  --easy-table-scrollbar-thumb-color: #4c5d7a;;
  --easy-table-scrollbar-corner-color: #2d3a4f;

  --easy-table-loading-mask-background-color: rgb(var(--v-theme-surface));
}
</style>