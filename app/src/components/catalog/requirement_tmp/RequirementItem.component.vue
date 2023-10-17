<script setup lang="ts">

import {Requirement} from "@/types/catalog.types.ts";

interface Props {
  requirement: Requirement | undefined,
}

const props = defineProps<Props>();


</script>

<template>
  <v-card :title="requirement?.title ? requirement?.title : 'Anforderung'"
          :text="requirement?.description ? requirement?.description : 'Wähle eine Anforderung'"
          variant="outlined">
  </v-card>
</template>