<script setup lang="ts">
interface Props {
  hint: string
}

const props = defineProps<Props>();
const showHint = ref<boolean>(false);

function toggleShowHint() {
  showHint.value = !showHint.value;
}
</script>

<template>

  <v-container>
    <v-row>
      <v-col class="d-flex flex-column justify-center align-center">
        <v-tooltip :text="showHint ? 'Hinweis verstecken' : 'Hinweis anzeigen'" location="top">
          <template v-slot:activator="{ props }">
            <v-btn v-bind="props"
                   icon="mdi-lightbulb"
                   @click="toggleShowHint"></v-btn>
          </template>
        </v-tooltip>
        <v-card
            class="mt-2"
            v-if="showHint"
            color="success"
            title="Hinweis"
            :text="hint"
        ></v-card>
      </v-col>
    </v-row>
  </v-container>

</template>

<style scoped>

</style>