<template>
  <v-row no-gutters class="d-flex align-items-center justify-space-between">
    <v-col cols="auto" class="text-h4">
      {{ lessonStore.currentLesson?.lessonDTO.title }}
    </v-col>
    <v-col cols="auto" class="text-h4">
      {{ lessonStore.currentLesson?.lessonDTO.points }}
      <v-icon class="mb-1 ml-2" size="35" color="warning" :icon="'mdi-star-four-points-circle-outline'"></v-icon>
    </v-col>
  </v-row>
  <v-divider opacity="1" class="my-2" />
  <v-row no-gutters>
    {{ lessonStore.currentLesson?.lessonDTO.description }}
  </v-row>
  <v-divider opacity="1" class="my-2" />
  <v-form @submit.prevent ref="formRef">
    <LessonQuestions :components="lessonStore.getLessonModules" />
  </v-form>
</template>
<script setup lang="ts">
import LessonQuestions from "@/components/lesson/generator/LessonQuestions.vue";
import { useLessonStore } from "@/stores/lesson.ts";
import { onMounted, ref } from "vue";
import { VForm } from "vuetify/components";

const lessonStore = useLessonStore();
const formRef = ref<VForm | null>(null);

onMounted(() => {
  lessonStore.lessonForm = formRef.value;
});
</script>