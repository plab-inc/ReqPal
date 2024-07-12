<template>
  <v-card
    variant="outlined"
    width="500"
    class="ma-3"
    rounded
    elevation="10"
  >
    <div class=svg-container v-html="scenario.svg"/>
    <v-card-title class="text-h4">
      {{ scenario.title }}
    </v-card-title>
    <v-card-text>
      {{ scenario.description }}
    </v-card-text>

    <v-card-actions>
      <v-container class="pa-0">
        <v-row no-gutters justify="center">
          <v-btn color="info" text="Bearbeiten" to="/scenario/builder"/>
          <v-btn disabled :color="scenario.deployed ? 'success' : 'grey'" text="Veröffentlichen"/>
          <v-btn disabled :color="scenario.locked ? 'warning' : 'grey'" text="Sperren"/>
          <v-btn disabled color="error" text="Löschen"/>
        </v-row>
        <v-row no-gutters>
          <v-btn block :append-icon="show ? 'mdi-chevron-up' : 'mdi-chevron-down'" text="Statistiken"  @click="show = !show" />
        </v-row>
      </v-container>
    </v-card-actions>

    <v-expand-transition>
      <div v-show="show">
        <v-divider class="mt-1"/>
        <v-card-text>
          <v-chip-group variant="outlined" selected-class="bg-deep-purple-lighten-2" column>
            <v-chip>All Versions</v-chip>
            <v-chip>Version 1</v-chip>
          </v-chip-group>
          <v-spacer/>
          <v-progress-linear
            bg-color="surface-variant"
            class="my-2"
            color="error"
            disabled
            height="10"
            model-value="100"
            rounded="pill"
          />
          <div>0 of 100 Students finished this scenario</div>
          <v-spacer class="my-2"/>
          <v-btn disabled variant="outlined" block text="Detailierte Ergebnisse"/>
        </v-card-text>
      </div>
    </v-expand-transition>
  </v-card>
</template>

<script setup lang="ts">
import { ref, defineProps } from 'vue';
import { Scenario } from "@/types/scenario.ts";

const props = defineProps<{
  scenario: Scenario
}>();

const show = ref<boolean>(false);
</script>

<style scoped>
.svg-container {
  display: flex;
  height: 200px;
  background: white;
  overflow: hidden;
  justify-content: center;
  align-items: center;
  padding: 16px;
}
</style>
