<script setup lang="ts">
import alertService from "@/services/util/alert.ts";
import {useLessonFormStore} from "@/stores/lessonForm.ts";

const props = defineProps<{ componentId: string }>();
const lessonFormStore = useLessonFormStore();

function openDeleteDialog() {
  alertService.openDialog(
      "Lektionsbaustein löschen",
      "Möchtest du diesen Lektionsbaustein wirklich löschen? Das Löschen ist unwiderruflich.",
      "Ja",
      "Nein",
      () => lessonFormStore.removeLessonModuleById(props.componentId)
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
