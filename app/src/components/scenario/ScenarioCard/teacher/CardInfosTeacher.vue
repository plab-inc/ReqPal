<template>
  <v-card-title class="text-h4 pb-0">
    {{ scenario ? scenario.title : "Leeres Szenario" }}
  </v-card-title>
  <v-card-subtitle :class="scenario?.locked ? 'text-red': 'text-success'">
    {{ scenario ? scenario.locked ? "Starten der Lektion gesperrt" : "Zum Starten der Lektion freigegeben" : "&nbsp;" }}
  </v-card-subtitle>
  <v-card-text style="height: 80px; overflow: hidden">
    {{ scenario ? scenario.description : "Hier können Sie ein neues Szenario erstellen. Bitte lesen Sie die Hinweise im Modellierer sorgfältig durch, um sicherzustellen, dass Sie alle notwendigen Konventionen berücksichtigen."
    }}
  </v-card-text>
</template>

<script setup lang="ts">
import { defineProps } from "vue";
import { Scenario } from "@/types/scenario.ts";

const props = defineProps<{
  scenario?: Scenario
}>();

</script>