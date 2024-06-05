<script setup lang="ts">
import alertService from "@/services/util/alert.ts";
import {useLessonStore} from "@/stores/lesson.ts";
import {useAuthStore} from "@/stores/auth.ts";

interface Props {
  questionId: string,
  hint: string
}

const props = defineProps<Props>();

const lessonStore = useLessonStore();
const authStore = useAuthStore();

function openWarningDialog() {
  if (authStore.isTeacher || (!lessonStore.currentLesson?.isStarted && lessonStore.currentLesson?.isFinished)) {
    openHintDialog();
  } else {
    alertService.openDialog('Warnung: Hinweise anzeigen',
        'Wenn Sie sich einen Hinweis anschauen, gibt es 10 Punkte Abzug pro Hinweis. ' +
        'Falls Sie sich diesen Hinweis bereits angeschaut haben, gibt es keine zusätzlichen Punktabzüge.',
        'Hinweis anzeigen', 'Zurück zur Lektion', openHintDialog);
  }
}

function openHintDialog() {
  alertService.openDialog('Hinweis', props.hint, 'Danke!', undefined, onHintClick)
}

async function onHintClick() {
  await lessonStore.uploadUsedHintForQuestion(props.questionId);
}
</script>

<template>
  <v-tooltip :text="'Hinweis'" location="top" v-if="hint.trim() !== ''">
    <template v-slot:activator="{ props }">
      <v-btn v-bind="props"
             :elevation="8"
             size="40"
             color="warning"
             icon="mdi-lightbulb-on-outline"
             @click.stop="openWarningDialog"></v-btn>
    </template>
  </v-tooltip>
</template>

<style scoped>

</style>