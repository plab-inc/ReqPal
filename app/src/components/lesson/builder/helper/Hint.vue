<script setup lang="ts">

import alertService from "@/services/util/alert.ts";

interface Props {
  hint: string
}

const props = defineProps<Props>();

function openHintDialog() {
  alertService.openDialog(
      "Hinweis",
      props.hint,
      "Danke!"
  )
}
</script>

<template>
  <v-tooltip :text="'Hinweis'" location="top" v-if="hint.trim() !== ''">
    <template v-slot:activator="{ props }">
      <v-btn v-bind="props"
             :elevation="8"
             size="40"
             color="warning"
             icon="mdi-lightbulb-on-outline"
             @click.stop="openHintDialog"
      />
    </template>
  </v-tooltip>
</template>