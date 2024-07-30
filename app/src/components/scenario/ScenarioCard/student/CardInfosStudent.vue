<template>
  <v-card-title class="text-h4 pb-0" style="overflow: auto">
    {{ scenario.title }}
  </v-card-title>
  <v-card-text style="height: 80px; overflow: scroll">
    {{ scenario.description }}
  </v-card-text>
</template>

<script setup lang="ts">
import { defineProps } from "vue";
import { Scenario } from "@/types/scenario.ts";

const props = defineProps<{
  scenario: Scenario
}>();

</script>