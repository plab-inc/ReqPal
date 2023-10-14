<script setup lang="ts">
import { useDrop } from 'vue3-dnd';
import { DragItemTypes } from '@/types/dragItem.types.ts';
import { toRefs } from '@vueuse/core';
import { useTheme } from "vuetify";
import {useLessonFormStore} from "@/stores/lessonForm.store";

import TrueOrFalse from "@/components/TrueOrFalse/TrueOrFalseForm.component.vue";
import RequirementItem from "@/components/Catalogs/Requirement/RequirementItem.component.vue";
import MultipleChoiceForm from "@/components/MultipleChoice/MultipleChoiceForm.component.vue";

import { LessonBuilderDragItem } from "@/interfaces/DragItems.interfaces.ts";

interface ComponentsMap {
  [key: string]: Component;
}

const themeColors = useTheme().current.value.colors;

const componentsMap: ComponentsMap = {
  'TrueOrFalse': markRaw(TrueOrFalse),
  'Requirement': markRaw(RequirementItem),
  'Multiple Choice': markRaw(MultipleChoiceForm),
};

const lessonBuilderStore = useLessonFormStore();
const components = computed(() => lessonBuilderStore.components);

const getComponentInstance = (componentName: string): Component => {
  return componentsMap[componentName];
};

const [collect, drop] = useDrop(() => ({
  accept: DragItemTypes.COMPONENT,
  drop: (item: LessonBuilderDragItem) => {
    lessonBuilderStore.addComponent(item.name);
  },
  collect: monitor => ({
    isOver: monitor.isOver(),
    canDrop: monitor.canDrop(),
  }),
}));

const { canDrop, isOver } = toRefs(collect);
const isActive = computed(() => unref(canDrop) && unref(isOver));

</script>

<template>
  <div
      :ref="drop"
      class="container"
      :style="{
      borderColor: isActive ? themeColors.success : themeColors.primary,
    }"
  >
    <v-container>
      <v-container class="scrollable-rows" v-if="components">
        <v-form @submit.prevent>
          <v-row v-for="componentEntry in components">
            <v-col cols="1" align-self="center">
              <v-btn
                  class="ma-2"
                  icon="mdi-delete"
                  @click="lessonBuilderStore.removeComponentById(componentEntry.id)"
              ></v-btn>
            </v-col>
            <v-col cols="11">
              <v-sheet class="pa-5" rounded>
                <component
                    :is="getComponentInstance(componentEntry.name)"
                    :key="componentEntry.id"
                    :componentId="componentEntry.id"
                ></component>
              </v-sheet>
            </v-col>
          </v-row>
        </v-form>
      </v-container>
      <v-container>
        <v-row>
          <v-col v-if="!components.length">
            <v-icon icon="mdi-tools"></v-icon>
          </v-col>
          <v-col>
            {{ !components.length ? "Füge Lernmodule hinzu indem du sie aus der Rechten Spalte herziehst" : "Füge weitere Lernmodule hinzu indem du sie aus der Rechten Spalte herziehst" }}
          </v-col>
        </v-row>
      </v-container>
    </v-container>
  </div>
</template>

<style scoped>
.scrollable-rows {
  max-height: 750px;
  overflow-y: auto;
}

.container {
  display: flex;
  border: 1px solid;
  border-radius: 5px;
  align-items: center;
  justify-content: center;
  text-align: center;
  min-height: 750px;
}
</style>
