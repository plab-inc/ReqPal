<script setup lang="ts">
import AlertService from "@/services/util/alert.ts";
import {DialogType} from "@/stores/util.ts";

interface Props {
  dialogType: DialogType
}

const props = defineProps<Props>();

</script>
<template>
  <v-tooltip :text="'Erklärung'" location="top">
    <template v-slot:activator="{ props }">
      <v-btn v-bind="props"
             icon="mdi-help"
             :elevation="8"
             color="info"
             size="40"
             @click="AlertService.addHelpDialog(props.dialogType)"></v-btn>
    </template>
  </v-tooltip>
</template>