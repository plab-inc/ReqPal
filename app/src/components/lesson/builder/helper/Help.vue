<script setup lang="ts">
import {DialogType} from "@/stores/util.ts";
import AlertService from "@/services/util/alert.ts";

interface Props {
  dialogType: DialogType
}

defineProps<Props>();
</script>
<template>
  <v-tooltip :text="'Erklärung'" location="top">
    <template v-slot:activator="{ props }">
      <v-btn v-bind="props"
             icon="mdi-help"
             :elevation="8"
             color="info"
             size="40"
             @click.stop="AlertService.addHelpDialog(dialogType)"></v-btn>
    </template>
  </v-tooltip>
</template>