<script setup lang="ts">

interface Props {
  options: any
}

const props = defineProps<Props>();
</script>

<template>
  <v-card>
    <v-card-title>
      <v-container>
        <v-row>
          <v-col class="d-flex justify-start align-center">
            <v-icon :icon="'mdi-'+options.icon.toLowerCase()" size="50px" class="mr-2"></v-icon>
            <div class="text-h4">{{ options.name }}</div>
          </v-col>
        </v-row>
      </v-container>
    </v-card-title>

    <v-card-actions>
      <v-btn
          variant="text"
          color="info"
      >
        Mehr Infos: {{ options.link }}
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<style scoped>

</style>