<script setup lang="ts">

import { Requirement } from "@/types/catalog.ts";

interface Props {
  requirement: Requirement | undefined,
}

defineProps<Props>();

</script>

<template>
  <v-card :title="requirement?.title ? requirement?.title : 'Anforderung'"
          :text="requirement?.description ? requirement?.description : 'Wähle eine Anforderung'"
          variant="outlined">
  </v-card>
</template>