<template>
  <v-chip-group variant="outlined" selected-class="bg-deep-purple-lighten-2" column>
    <v-chip>All Versions</v-chip>
    <v-chip>Version 1</v-chip>
  </v-chip-group>
  <v-spacer />
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
  <v-spacer class="my-2" />
  <v-btn disabled variant="outlined" block text="Detailierte Ergebnisse" />
</template>