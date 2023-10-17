<script setup lang="ts">

import TrueOrFalse from "@/components/lesson/modules/TrueOrFalse.component.vue"
import Requirement from "@/components/catalog/requirement/Requirement.component.vue"
import MultipleChoice from "@/components/lesson/modules/MultipleChoice.component.vue"
import Slider from "@/components/lesson/modules/Slider.component.vue"
import Textfield from "@/components/lesson/modules/Textfield.component.vue"
import Notes from "@/components/lesson/modules/Notes.component.vue"
import Product from "@/components/lesson/modules/Product.component.vue"
import {useLessonStore} from "@/stores/lesson.store.ts";
import {useLessonFormStore} from "@/stores/lessonForm.store.ts";

const lessonStore = useLessonStore();

const sortedQuestions = lessonStore.getSortedCurrentQuestions;
const currentLesson = lessonStore.getCurrentLesson;

const lessonFormStore = useLessonFormStore();

interface ComponentsMap {
  [key: string]: Component;
}

const componentsMap: ComponentsMap = {
  'TrueOrFalse': markRaw(TrueOrFalse),
  'Requirement': markRaw(Requirement),
  'MultipleChoice': markRaw(MultipleChoice),
  'Slider': markRaw(Slider),
  'Textfield': markRaw(Textfield),
  'Note': markRaw(Notes),
  'Products': markRaw(Product),
};
const getComponentInstance = (componentName: string): Component => {
  return componentsMap[componentName];
};

if (lessonFormStore.components.length <= 0) {
  sortedQuestions.forEach(q => {
    lessonFormStore.addComponentWithData(q.question_type, {
      question: q.question,
      options: q.options,
      solution: q.solution,
      hint: q.hint
    })
  })
}
const questionComponents = lessonFormStore.components;
const formValues = lessonFormStore.components;

function submit() {
  console.log("submit!")
}
</script>

<template>
  {{ sortedQuestions }}
  <v-container v-if="sortedQuestions.length <= 0">
    <div class="text-subtitle-1">Noch keine Fragen!</div>
  </v-container>

  <v-container v-else>
    <v-row class="mb-4">
      <v-col cols="10">
        <div class="text-h3">{{ currentLesson?.title }}</div>
        <div class="text-h5 mt-4">{{ currentLesson?.description }}</div>
      </v-col>
      <v-col cols="2" class="d-flex justify-space-between">
        <div class="text-h6 text-lg-h4">{{ currentLesson?.points }} Punkte</div>
        <v-progress-circular
            color="primary"
            model-value="20"
            :size="50"
            :width="7"
        ></v-progress-circular>
      </v-col>
    </v-row>

    <v-divider></v-divider>
    <v-form @submit.prevent="submit">
      <v-row class="mt-4">
        <v-col>
          <v-container v-if="questionComponents">
            <v-row v-for="question in questionComponents">
              <v-col class="my-2">
                <v-sheet class="pa-3" rounded elevation="3">
                  <component
                      :is="getComponentInstance(question.type)"
                      :key="question.id"
                      :componentId="question.id"
                  ></component>
                </v-sheet>
              </v-col>
            </v-row>
          </v-container>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-container>
            <v-btn type="submit">Submit</v-btn>
          </v-container>
        </v-col>
      </v-row>
    </v-form>
  </v-container>
</template>

<style scoped>

</style>