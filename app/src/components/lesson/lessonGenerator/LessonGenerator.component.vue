<script setup lang="ts">

import TrueOrFalse from "@/components/lesson/modules/TrueOrFalse.component.vue"
import Requirement from "@/components/catalog/Requirement/Requirement.component.vue"
import MultipleChoice from "@/components/lesson/modules/MultipleChoice.component.vue"
import Slider from "@/components/lesson/modules/Slider.component.vue"
import Textfield from "@/components/lesson/modules/Textfield.component.vue"
import Notes from "@/components/lesson/modules/Notes.component.vue"
import Product from "@/components/lesson/modules/Product.component.vue"

let idNext = 0;

const components = [
  {
    id: idNext++, question: 'Frage Slider', question_type: 'Slider',
    options: {minValue: 0, maxValue: 20, steps: 1}, hint: 'Hinweis Test Test', position: 1
  },
  {
    id: idNext++, question: '', question_type: 'Requirement',
    options: {catalogId: 177, requirementId: 490}, hint: '', position: 0
  }
]

components.sort((a, b) => a.position - b.position);

interface ComponentsMap {
  [key: string]: Component;
}

const componentsMap: ComponentsMap = {
  'TrueOrFalse': markRaw(TrueOrFalse),
  'Requirement': markRaw(Requirement),
  'Multiple Choice': markRaw(MultipleChoice),
  'Slider': markRaw(Slider),
  'Textfeld': markRaw(Textfield),
  'Notizen': markRaw(Notes),
  'Produkte': markRaw(Product),
};
const getComponentInstance = (componentName: string): Component => {
  return componentsMap[componentName];
};
</script>

<template>
  <v-container>
    <v-row class="mb-4">
      <v-col cols="10">
        <div class="text-h3">Lektion Titel</div>
      </v-col>
      <v-col cols="2" class="d-flex justify-space-between">
        <div class="text-h6 text-lg-h4">200 Punkte</div>
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
        <v-container v-if="components">
          <v-row v-for="componentEntry in components">
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