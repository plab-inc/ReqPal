<script setup lang="ts">

import {Lesson} from "@/types/lesson.types.ts";

interface Props {
  lesson: Lesson
}

const props = defineProps<Props>();

</script>

<template>
  <div class="d-flex align-center justify-end">
    <div v-if="lesson.isFinished" class="text-h6 mr-1">{{ lesson.userScore }} / {{ lesson.lessonDTO.points }}</div>
    <div v-if="!lesson.isFinished" class="text-h6 mr-1">{{ lesson.lessonDTO.points }}</div>
    <v-icon class="mr-4" size="35" :icon="'mdi-star-four-points-circle-outline'"></v-icon>
    <v-badge
        inline
        :color="lesson.isFinished ? 'success' : 'error'"
        :content="lesson.isFinished ? 'ABGESCHLOSSEN' : 'NEU'">
    </v-badge>
    <v-badge
        v-if="lesson.isFinished && lesson.isStarted"
        inline
        :color="'warning'"
        :content="'BEGONNEN'">
    </v-badge>
  </div>
</template>

<style scoped>

</style>