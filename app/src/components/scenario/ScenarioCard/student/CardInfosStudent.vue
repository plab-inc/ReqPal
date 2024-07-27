<template>
  <v-card-title class="text-h4 pb-0">
    {{ scenario?.title }}
  </v-card-title>
  <v-card-subtitle :class="scenario?.locked ? 'text-red': 'text-success'">
    {{ scenario?.locked ? "Das starten der Lektion wurde gesperrt" : "Starten der Lektion freigegeben" }}
  </v-card-subtitle>
  <v-card-text style="height: 80px; overflow: hidden">
    {{ scenario?.description }}
  </v-card-text>
</template>

<script setup lang="ts">
import { defineProps } from "vue";
import { Scenario } from "@/types/scenario.ts";

const props = defineProps<{
  scenario?: Scenario
}>();

</script>