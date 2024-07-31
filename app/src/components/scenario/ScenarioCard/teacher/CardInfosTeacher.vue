<template>
  <v-card-title class="text-h4 pb-0">
    <v-row no-gutters justify-space-between>
      <v-col cols="8" style="text-overflow: ellipsis; overflow: hidden">
        {{ scenario ? scenario.title : "Leeres Szenario" }}
      </v-col>
      <v-col v-if="scenario" cols="4" class="d-flex justify-end align-center">
        <v-tooltip :text="scenario?.locked ? 'Szenario Gesperrt' : 'Szenario Freigegeben'" location="top">
          <template v-slot:activator="{ props }">
            <v-icon v-bind="props" size="extra-small" :color="scenario?.locked ? 'red' : 'success'"
                    :icon="scenario?.locked ? 'mdi-lock' : 'mdi-lock-open'" class="mr-2" />
          </template>
        </v-tooltip>
        <v-tooltip :text="scenario?.deployed ? 'Szenario Veröffentlicht' : 'Szenario Nicht Veröffentlicht'"
                   location="top">
          <template v-slot:activator="{ props }">
            <v-icon v-bind="props" size="extra-small" :color="scenario?.deployed ? 'success' : 'white'"
                    :icon="scenario?.deployed ? 'mdi-broadcast' : 'mdi-broadcast-off'" />
          </template>
        </v-tooltip>
      </v-col>
    </v-row>
  </v-card-title>
  <v-card-subtitle>
    {{ scenario?.deployed ? "Veröffentlichte " : "" }} {{ scenario ? "Version: " + scenario.version : "&nbsp;" }}
  </v-card-subtitle>
  <v-card-text :style="scenario ? 'height: 80px; overflow: scroll' : 'height: 80px;'">
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