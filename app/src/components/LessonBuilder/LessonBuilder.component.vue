<script setup lang="ts">
import {useDrop} from 'vue3-dnd';
import {DragItemTypes} from '@/types/dragItem.types.ts';
import {toRefs} from '@vueuse/core';
import {useTheme} from "vuetify";
import {useLessonFormStore} from "@/stores/lessonForm.store";

import TrueOrFalse from "@/components/TrueOrFalse/TrueOrFalseForm.component.vue";
import RequirementItem from "@/components/Catalogs/Requirement/RequirementItem.component.vue";
import MultipleChoiceForm from "@/components/MultipleChoice/MultipleChoiceForm.component.vue";
import TextInput from "@/components/Notes/TextInput.component.vue";
import {LessonBuilderDragItem} from "@/interfaces/DragItems.interfaces.ts";

interface ComponentsMap {
  [key: string]: Component;
}

const themeColors = useTheme().current.value.colors;

const componentsMap: ComponentsMap = {
  'TrueOrFalse': markRaw(TrueOrFalse),
  'Requirement': markRaw(RequirementItem),
  'Multiple Choice': markRaw(MultipleChoiceForm),
  'Textfeld': markRaw(TextInput)
};

const lessonFormStore = useLessonFormStore();
const components = computed(() => lessonFormStore.components);

const getComponentInstance = (componentName: string): Component => {
  return componentsMap[componentName];
};

const [collect, drop] = useDrop(() => ({
  accept: DragItemTypes.COMPONENT,
  drop: (item: LessonBuilderDragItem) => {
    lessonFormStore.addComponent(item.name);
  },
  collect: monitor => ({
    isOver: monitor.isOver(),
    canDrop: monitor.canDrop(),
  }),
}));

const {canDrop, isOver} = toRefs(collect);
const isActive = computed(() => unref(canDrop) && unref(isOver));
const form = ref<any>(null);

const fields = ref<any>({
  title: lessonFormStore.getLessonFormTitle,
  points: lessonFormStore.getLessonFormPoints
});

const checkValidity = () => {
  return form.value ? form.value.validate() : false;
};

defineExpose({
  checkValidity
});

watch(fields, (newFields) => {
  lessonFormStore.setLessonTitle(newFields.title);
  lessonFormStore.setLessonPoints(newFields.points);
}, {deep: true});

</script>

<template>
  <v-container>
    <v-form @submit.prevent ref="form">
      <v-row>
        <v-col cols="10">
          <v-text-field
              clearable
              label="Titel der Lektion"
              variant="outlined"
              v-model="fields.title"
          ></v-text-field>
        </v-col>
        <v-col cols="2">
          <v-text-field
              label="Punktzahl bei Abschluss"
              variant="outlined"
              type="number"
              v-model="fields.points"
          />
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <div
              :ref="drop"
              class="container"
              :style="{borderColor: isActive ? themeColors.success : themeColors.primary}"
          >
            <v-container>
              <v-container class="scrollable-rows" v-if="components">
                <v-row v-for="componentEntry in components">
                  <v-col cols="1" align-self="center">
                    <v-btn
                        class="ma-2"
                        icon="mdi-delete"
                        @click="lessonFormStore.removeComponentById(componentEntry.id)"
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
              </v-container>
              <v-container>
                <v-row>
                  <v-col v-if="!components.length">
                    <v-icon icon="mdi-tools"></v-icon>
                  </v-col>
                  <v-col>
                    {{
                      !components.length ? "Füge Lernmodule hinzu indem du sie aus der Rechten Spalte herziehst" : "Füge weitere Lernmodule hinzu indem du sie aus der Rechten Spalte herziehst"
                    }}
                  </v-col>
                </v-row>
              </v-container>
            </v-container>
          </div>
        </v-col>
      </v-row>
    </v-form>
  </v-container>
</template>

<style scoped>
.scrollable-rows {
  max-height: 600px;
  overflow-y: auto;
}

.container {
  display: flex;
  border: 1px solid;
  border-radius: 5px;
  align-items: center;
  justify-content: center;
  text-align: center;
  min-height: 650px;
}
</style>
