<script setup lang="ts">

interface Props {
  options: any
}

const props = defineProps<Props>();
const openLink = () => {
  window.open(props.options.link);
}
</script>

<template>
  <v-hover>
    <template v-slot:default="{ isHovering, props }">
      <v-card
          variant="outlined"
          v-bind="props"
          :color="isHovering ? 'info' : undefined"
          @click="openLink"
      >
        <v-container>
          <v-row>
            <v-col cols="9">
              <v-card-title class="text-h4">
                {{ options.name }}
              </v-card-title>
              <v-card-text>
                {{ options.link }}
              </v-card-text>
            </v-col>
            <v-col cols="3">
              <v-icon :icon="options.icon" size="100"></v-icon>
            </v-col>
          </v-row>
        </v-container>
      </v-card>
    </template>
  </v-hover>
</template>

<style scoped>

</style>