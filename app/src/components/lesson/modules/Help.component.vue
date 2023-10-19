<script setup lang="ts">
import AlertService from "@/services/util/alert.service.ts";
import {DialogType} from "@/stores/util.store.ts";

interface Props {
  dialogType: DialogType
}

const props = defineProps<Props>();

</script>
<template>
  <v-tooltip :text="'Hilfe'" location="top">
    <template v-slot:activator="{ props }">
      <v-btn v-bind="props"
             icon="mdi-help"
             size="35"
             @click="AlertService.addHelpDialog(dialogType, ()=>{})"></v-btn>
    </template>
  </v-tooltip>
</template>

<style scoped>

</style>
