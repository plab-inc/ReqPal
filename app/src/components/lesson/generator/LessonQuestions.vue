<script setup lang="ts">
import {LessonModuleEntry} from "@/stores/lesson.ts";
import DividerModule from "@/components/lesson/modules/divider/DividerModule.vue";
import TrueOrFalseModule from "@/components/lesson/modules/trueOrFalse/TrueOrFalseModule.vue";
import RequirementModule from "@/components/lesson/modules/requirement/RequirementModule.vue";
import MultipleChoiceModule from "@/components/lesson/modules/multipleChoice/MultipleChoiceModule.vue";
import SliderModule from "@/components/lesson/modules/slider/SliderModule.vue";
import TextfieldModule from "@/components/lesson/modules/textfield/TextfieldModule.vue";
import NotesModule from "@/components/lesson/modules/notes/NotesModule.vue";
import { ComponentInstance, markRaw } from "vue";

interface Props {
  components: LessonModuleEntry[];
}

const props = defineProps<Props>();

interface LessonModuleMap {
  [key: string]: ComponentInstance<any>;
}

const lessonModuleMap: LessonModuleMap = {
  'TrueOrFalse': markRaw(TrueOrFalseModule),
  'Requirement': markRaw(RequirementModule),
  'MultipleChoice': markRaw(MultipleChoiceModule),
  'Slider': markRaw(SliderModule),
  'Textfield': markRaw(TextfieldModule),
  'Note': markRaw(NotesModule),
  'Divider': markRaw(DividerModule)
};
const getLessonModuleInstance = (lessonModuleName: string): ComponentInstance<any> => {
  return lessonModuleMap[lessonModuleName];
};

function isRequirementOrTextfieldOrDivider(componentType: string): boolean {
  return componentType === 'Textfield' || componentType === 'Divider';
}
</script>

<template>
  <v-container v-if="components">
    <v-row v-for="question in components" no-gutters>
      <v-col class="my-2">
        <v-sheet
            :class="isRequirementOrTextfieldOrDivider(question.type) ? '' : 'pa-3'"
            rounded
            :elevation="isRequirementOrTextfieldOrDivider(question.type) ? '0' : '8'">
          <component
              :is="getLessonModuleInstance(question.type)"
              :key="question.uuid"
              :componentId="question.uuid"
          ></component>
        </v-sheet>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>

</style>Component, 