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
    <v-tooltip :text="showHint ? 'Hinweis verstecken' : 'Hinweis anzeigen'" location="top">
      <template v-slot:activator="{ props }">
        <v-btn v-bind="props"
               size="40"
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
</template>

<style scoped>

</style>