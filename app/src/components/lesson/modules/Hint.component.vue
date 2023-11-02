<script setup lang="ts">
import alertService from "@/services/util/alert.service.ts";
import {useLessonStore} from "@/stores/lesson.store.ts";

interface Props {
  questionId: string,
  hint: string
}

const props = defineProps<Props>();
const showHint = ref<boolean>(false);

function toggleShowHint() {
  showHint.value = !showHint.value;
}

const lessonStore = useLessonStore();

async function onHintClick() {
  await lessonStore.uploadUsedHintForQuestion(props.questionId);
}
</script>

<template>
  <v-tooltip :text="showHint ? 'Hinweis verstecken' : 'Hinweis anzeigen'" location="top">
    <template v-slot:activator="{ props }">
      <v-btn v-bind="props"
             size="40"
             icon="mdi-lightbulb"
             @click="alertService.openDialog('Hinweis', hint, 'Danke!', undefined, onHintClick)"></v-btn>
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