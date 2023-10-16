<script setup lang="ts">

import TrueOrFalse from "@/components/lesson/modules/TrueOrFalse.component.vue"
import Requirement from "@/components/catalog/Requirement/Requirement.component.vue"
import MultipleChoice from "@/components/lesson/modules/MultipleChoice.component.vue"
import Slider from "@/components/lesson/modules/Slider.component.vue"
import Textfield from "@/components/lesson/modules/Textfield.component.vue"
import Notes from "@/components/lesson/modules/Notes.component.vue"
import Product from "@/components/lesson/modules/Product.component.vue"
import {useLessonStore} from "@/stores/lesson.store.ts";
import {storeToRefs} from "pinia";

const lessonStore = useLessonStore();
const {currentLesson, currentQuestions} = storeToRefs(lessonStore)

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
</script>

<template>
  <v-container v-if="currentQuestions.length <= 0">
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
            :size="49"
            :width="7"
        ></v-progress-circular>
      </v-col>
    </v-row>

    <v-divider></v-divider>

    <v-row class="mt-4">
      <v-col>
        <v-container v-if="currentQuestions">
          <v-row v-for="componentEntry in currentQuestions">
            <v-col class="my-2">
              <v-sheet class="pa-3" rounded>
                <component
                    :is="getComponentInstance(componentEntry.question_type)"
                    :key="componentEntry.id"
                    :componentId="componentEntry.id"
                    :question="componentEntry.question"
                    :options="componentEntry.options"
                    :hint="componentEntry.hint"
                ></component>
              </v-sheet>
            </v-col>
          </v-row>
        </v-container>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>

</style>