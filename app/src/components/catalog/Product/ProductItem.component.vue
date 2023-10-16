<script setup lang="ts">

interface Props {
  options: any
}

const props = defineProps<Props>();
</script>

<template>
  <v-hover>
    <template v-slot:default="{ isHovering, props }">
      <v-card
          variant="flat"
          v-bind="props"
          :color="isHovering ? 'info' : undefined">
        <v-card-title>
          <v-container>
            <v-row>
              <v-col class="d-flex justify-start align-center">
                <v-icon :icon="options.icon.toLowerCase()" size="50px" class="mr-2"></v-icon>
                <div class="text-h4">{{ options.name }}</div>
              </v-col>
            </v-row>
          </v-container>
        </v-card-title>
        <v-card-text>
          <v-chip prepend-icon="mdi-web" variant="text">
            {{ options.link }}
          </v-chip>
        </v-card-text>
      </v-card>
    </template>
  </v-hover>
</template>

<style scoped>

</style>