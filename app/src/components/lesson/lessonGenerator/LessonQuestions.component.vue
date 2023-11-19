<script setup lang="ts">
import {ComponentEntry} from "@/stores/lesson.store.ts";
import TrueOrFalse from "@/components/lesson/lessonModules/TrueOrFalse.component.vue";
import Requirement from "@/components/catalog/requirement/Requirement.component.vue";
import MultipleChoice from "@/components/lesson/lessonModules/MultipleChoice.component.vue";
import Slider from "@/components/lesson/lessonModules/Slider.component.vue";
import Textfield from "@/components/lesson/lessonModules/Textfield.component.vue";
import Notes from "@/components/lesson/lessonModules/Notes.component.vue";
import Divider from "@/components/lesson/lessonModules/Divider.component.vue";

interface Props {
  components: ComponentEntry[];
}

const props = defineProps<Props>();

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
  'Divider': markRaw(Divider)
};
const getComponentInstance = (componentName: string): Component => {
  return componentsMap[componentName];
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
              :is="getComponentInstance(question.type)"
              :key="question.uuid"
              :componentId="question.uuid"
          ></component>
        </v-sheet>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>

</style>