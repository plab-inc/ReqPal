<template>
  <v-container>
    <div>
      <div class="text-md-h3 text-sm-h4 text-h6">{{ currentLesson?.title }}</div>
    </div>

    <div v-if="currentQuestions.length <= 0">
      <div class="text-subtitle-1">Noch keine Fragen!</div>
    </div>

    <div v-if="currentLesson">
      <LessonRequirements :lesson="currentLesson"></LessonRequirements>
    </div>

    <div v-if="currentQuestions.length > 0">
      <MultipleChoice v-for="question in multipleChoiceQuestions" :key="question.id"
                      :question="question"></MultipleChoice>
      <TrueOrFalse v-for="question in trueOrFalseQuestions" :key="question.id" :question="question"></TrueOrFalse>
      <Sortable v-for="question in sortableQuestions" :key="question.id" :question="question"></Sortable>
    </div>
  </v-container>
</template>

<script setup lang="ts">

import MultipleChoice from "@/components/MultipleChoice/MultipleChoice.component.vue";
import TrueOrFalse from "@/components/TrueOrFalse/TrueOrFalse.component.vue";
import Sortable from "@/components/Sortable/Sortable.component.vue";
import {useLessonStore} from "@/stores/lesson.store";
import {storeToRefs} from 'pinia'
import LessonRequirements from "@/components/Catalogs/LessonRequirements.component.vue";

const lessonStore = useLessonStore();
const {currentLesson, currentQuestions} = storeToRefs(lessonStore)
const multipleChoiceQuestions = computed(() => lessonStore.getMultipleChoiceQuestions);
const trueOrFalseQuestions = computed(() => lessonStore.getTrueOrFalseQuestions);
const sortableQuestions = computed(() => lessonStore.getSortableQuestions);
</script>