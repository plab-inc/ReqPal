<script setup lang="ts">

import {Requirement} from "@/types/catalog.types.ts";
import {requiredRule} from "@/utils/validationRules.ts";

interface Props {
  items: Requirement[],
  loading: boolean,
  modelValue: Requirement | undefined
}

const props = defineProps<Props>();

const emit = defineEmits(['update:modelValue']);

const selectedRequirement = computed({
  get() {
    return props.modelValue;
  },
  set(newValue) {
    emit('update:modelValue', newValue);
  }
})
</script>

<template>
  <v-select
      label="Anforderung wählen"
      v-model="selectedRequirement"
      :rules="[requiredRule]"
      :items="items"
      :item-title="item => item.title"
      :item-value="item => item"
      :loading="loading"
  ></v-select>
</template>
<style scoped>

</style>