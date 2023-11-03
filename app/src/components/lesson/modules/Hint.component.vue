<script setup lang="ts">
import alertService from "@/services/util/alert.service.ts";
import {useLessonStore} from "@/stores/lesson.store.ts";

interface Props {
  questionId: string,
  hint: string
}

const props = defineProps<Props>();

const lessonStore = useLessonStore();

function openWarningDialog() {
  alertService.openDialog('Warnung: Hinweise anzeigen',
      'Wenn Sie sich einen Hinweis anschauen, gibt es 10 Punkte Abzug pro Hinweis. ' +
      'Falls Sie sich diesen Hinweis bereits angeschaut haben, gibt es keine zusätzlichen Punktabzüge.',
      'Hinweis anzeigen', 'Zurück zur Lektion', openHintDialog);
}

function openHintDialog() {
  alertService.openDialog('Hinweis', props.hint, 'Danke!', undefined, onHintClick)
}

async function onHintClick() {
  await lessonStore.uploadUsedHintForQuestion(props.questionId);
}
</script>

<template>
  <v-tooltip :text="'Hinweis'" location="top">
    <template v-slot:activator="{ props }">
      <v-btn v-bind="props"
             size="40"
             icon="mdi-lightbulb"
             @click="openWarningDialog"></v-btn>
    </template>
  </v-tooltip>
</template>

<style scoped>

</style>