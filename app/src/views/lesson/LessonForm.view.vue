<script setup lang="ts">
import {ref} from 'vue';
import TrueOrFalseForm from "@/components/TrueOrFalse/TrueOrFalseForm.component.vue";
import MultipleChoiceForm from "@/components/MultipleChoice/MultipleChoiceForm.component.vue";
import {useLessonStore} from "@/stores/lesson.store";
import {questionTypes} from "@/types/lesson.types";
import customDialog from "@/components/CustomDialog.component.vue";

const lessonStore = useLessonStore();
const lesson = lessonStore.getLessonById;
const selectedType = ref<string>('');
const openChangeTypeDialog = ref<boolean>(false);

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

        <custom-dialog
            v-if="openChangeTypeDialog"
            title="Warning"
            message="You have unsaved content. Changing the question type will discard this content. Are you sure?"
            confirmLabel="Change Question Type"
            @cancel="openChangeTypeDialog = false"
            @confirm="selectedType=''; openChangeTypeDialog = false;"
        ></custom-dialog>

        <v-btn @click="openChangeTypeDialog = true">Change Question Type</v-btn>
      </v-col>
    </v-row>
  </div>
</template>

<style scoped>
</style>
