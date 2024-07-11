<template>
  <v-card
    variant="outlined"
    width="500"
    class="ma-3"
    rounded
    elevation="10"
  >
    <v-img
      class="align-end text-white"
      height="200"
      src="https://cdn.vuetifyjs.com/images/cards/docks.jpg"
      cover
    >
      <v-card-title>
        Scenario Title
      </v-card-title>
    </v-img>

    <v-card-text>
      <div>Whitehaven Beach</div>

      <div>Whitsunday Island, Whitsunday Islands</div>
    </v-card-text>

    <v-card-actions>
      <v-container class="pa-0">
        <v-row no-gutters justify="center">
            <v-btn color="info" text="Bearbeiten" to="/scenario/builder"/>
            <v-btn color="success" text="Veröffentlichen"/>
            <v-btn color="warning" text="Sperren"/>
            <v-btn color="error" text="Löschen"/>
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
          <v-chip-group variant="outlined"  selected-class="bg-deep-purple-lighten-2" column>
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

import { ref } from "vue";

const show = ref<boolean>(false)

</script>