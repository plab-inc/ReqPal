<script setup lang="ts">
import CustomDialog from "@/components/dialog/CustomDialog.component.vue";

interface Props {
  title: string,
  text: string
}

const props = defineProps<Props>();
const showHelp = ref<boolean>(false);
</script>

<template>
  <v-tooltip :text="'Hilfe'" location="top">
    <template v-slot:activator="{ props }">
      <v-btn v-bind="props"
             icon="mdi-help"
             size="35"
             @click="showHelp = true"></v-btn>
    </template>
  </v-tooltip>

  <CustomDialog v-model="showHelp"
                :message="text"
                :title="title"
                confirm-label="Verstanden!"
                cancel-label="Zurück zur Lektion">
  </CustomDialog>
</template>

<style scoped>

</style>