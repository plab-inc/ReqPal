<script setup lang="ts">
import {ref} from 'vue';
import TrueOrFalseForm from "@/components/TrueOrFalse/TrueOrFalseForm.component.vue";
import MultipleChoiceForm from "@/components/MultipleChoice/MultipleChoiceForm.component.vue";
import {useLessonStore} from "@/stores/lesson.store";
import {questionTypes} from "@/types/lesson.types";

const lessonStore = useLessonStore();
const lesson = lessonStore.getLessonById;
const selectedType = ref<string>('');
const openDialog = ref<boolean>(false);
</script>

<template>
  <h1>{{ lesson?.title }}</h1>

  <div v-if="!selectedType">
    <h2>Choose Question Type</h2>
    <v-radio-group v-model="selectedType" label="Type of question">
      <v-radio label="True or False" value="TrueOrFalse"></v-radio>
      <v-radio label="Multiple Choice" value="MultipleChoice"></v-radio>
    </v-radio-group>
  </div>

  <div v-else>
    <v-row>
      <v-col>
        <TrueOrFalseForm v-if="selectedType === questionTypes.TrueOrFalse"></TrueOrFalseForm>
        <MultipleChoiceForm v-if="selectedType === questionTypes.MultipleChoice"></MultipleChoiceForm>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-dialog v-model="openDialog" max-width="800px">
          <v-card>
            <v-card-title>Warning</v-card-title>
            <v-card-text>
              You have unsaved content. Changing question type will discard this content. Are you sure?
            </v-card-text>
            <v-card-actions>
              <v-btn @click="openDialog = false">Cancel</v-btn>
              <v-btn color="error" @click="selectedType=''; openDialog = false;">Change Question Type</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <v-btn @click="openDialog = true">Change Question Type</v-btn>
      </v-col>
    </v-row>
  </div>

</template>

<style scoped>

</style>
