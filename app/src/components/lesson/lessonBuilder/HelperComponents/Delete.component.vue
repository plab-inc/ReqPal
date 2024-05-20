<script setup lang="ts">
import AlertService from "@/services/util/alert.service.ts";
import {DialogType} from "@/stores/util.store.ts";
import alertService from "@/services/util/alert.service.ts";
import {useLessonFormStore} from "@/stores/lessonForm.store.ts";

const props = defineProps<{ componentId: string }>();
const lessonFormStore = useLessonFormStore();

function openDeleteDialog() {
  alertService.openDialog(
      "Lektionsbaustein löschen",
      "Möchtest du dieses Lektionsbaustein wirklich löschen? Das Löschen ist unwiderruflich.",
      "Ja",
      "Nein",
      () => lessonFormStore.removeComponentById(props.componentId)
  )
}

</script>
<template>
  <v-tooltip :text="'Baustein löschen'" location="top">
    <template v-slot:activator="{ props }">
      <v-btn v-bind="props"
             icon="mdi-trash-can-outline"
             :elevation="8"
             color="error"
             size="40"
             @click="openDeleteDialog"></v-btn>
    </template>
  </v-tooltip>
</template>

<style scoped>

</style>
