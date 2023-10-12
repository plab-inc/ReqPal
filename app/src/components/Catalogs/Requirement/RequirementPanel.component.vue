<script setup lang="ts">
import {Requirement} from "@/types/catalog.types.ts";
import RequirementItem from "@/components/Catalogs/Requirement/RequirementItem.component.vue"

interface Props {
  requirements: Requirement[]
}

const props = defineProps<Props>();

</script>

<template>
  <v-expansion-panels>
    <v-expansion-panel>
      <v-expansion-panel-title>
        Anforderungen
      </v-expansion-panel-title>
      <v-expansion-panel-text>
        <v-col v-for="requirement in requirements" :key="requirement.requirement_id">
          <RequirementItem :requirement="requirement"></RequirementItem>
        </v-col>
      </v-expansion-panel-text>
    </v-expansion-panel>
  </v-expansion-panels>
</template>