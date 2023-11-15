<script setup lang="ts">
import {ComponentEntry} from "@/stores/lesson.store.ts";
import TrueOrFalse from "@/components/lesson/modules/TrueOrFalse.component.vue";
import Requirement from "@/components/catalog/requirement/Requirement.component.vue";
import MultipleChoice from "@/components/lesson/modules/MultipleChoice.component.vue";
import Slider from "@/components/lesson/modules/Slider.component.vue";
import Textfield from "@/components/lesson/modules/Textfield.component.vue";
import Notes from "@/components/lesson/modules/Notes.component.vue";
import Product from "@/components/lesson/modules/Product.component.vue";
import Divider from "@/components/lesson/modules/Divider.component.vue";

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
  'Products': markRaw(Product),
  'Divider': markRaw(Divider)
};
const getComponentInstance = (componentName: string): Component => {
  return componentsMap[componentName];
};

function isRequirementOrTextfieldOrDivider(componentType: string): boolean {
  return componentType === 'Requirement' || componentType === 'Textfield' || componentType === 'Divider';
}
</script>

<template>
  <v-container v-if="components">
    <v-row v-for="question in components">
      <v-col class="my-2">
        <v-sheet
            :class="isRequirementOrTextfieldOrDivider(question.type) ? '' : 'pa-3'"
            rounded
            :elevation="isRequirementOrTextfieldOrDivider(question.type) ? '0' : '3'">
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