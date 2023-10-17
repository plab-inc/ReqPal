<script setup lang="ts">
import {useDrop} from 'vue3-dnd';
import {DragItemTypes} from '@/types/dragItem.types.ts';
import {toRefs} from '@vueuse/core';
import {useTheme} from "vuetify";
import {useLessonFormStore} from "@/stores/lessonForm.store.ts";

import TrueOrFalse from "@/components/lesson/forms/TrueOrFalseForm.component.vue";
import MultipleChoiceForm from "@/components/lesson/forms/MultipleChoiceForm.component.vue";
import SliderForm from "@/components/lesson/forms/SliderForm.component.vue";
import TextfieldForm from "@/components/lesson/forms/TextfieldForm.component.vue";
import {LessonBuilderDragItem} from "@/interfaces/DragItems.interfaces.ts";
import CatalogRequirementSelection from "@/components/lesson/forms/CatalogRequirementSelectionForm.component.vue"
import NotesForm from "@/components/lesson/forms/NotesForm.component.vue";
import ProductChoiceForm from "@/components/lesson/forms/ProductChoiceForm.component.vue";
import LessonModuleBox from "@/components/lesson/lessonBuilder/LessonModuleBox.component.vue";
import LessonService from "@/services/database/lesson.service.ts";

interface ComponentsMap {
  [key: string]: Component;
}

const themeColors = useTheme().current.value.colors;

const templates = ['Requirement', 'Products', 'TrueOrFalse', 'MultipleChoice', 'Textfield', 'Note', 'Slider']

const componentsMap: ComponentsMap = {
  'TrueOrFalse': markRaw(TrueOrFalse),
  'Requirement': markRaw(CatalogRequirementSelection),
  'MultipleChoice': markRaw(MultipleChoiceForm),
  'Slider': markRaw(SliderForm),
  'Textfield': markRaw(TextfieldForm),
  'Note': markRaw(NotesForm),
  'Products': markRaw(ProductChoiceForm),
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
  points: lessonFormStore.getLessonFormPoints,
  description: lessonFormStore.getLessonFormDescription,
});

const checkValidity = () => {
  return form.value ? form.value.validate() : false;
};

function uploadLesson() {

  let lessonJson = lessonFormStore.generateLessonJSON();
  console.log(lessonJson);

  LessonService.push.uploadLesson(lessonJson);

}

defineExpose({
  checkValidity
});

watch(fields, (newFields) => {
  lessonFormStore.setLessonTitle(newFields.title);
  lessonFormStore.setLessonPoints(newFields.points);
  lessonFormStore.setLessonDescription(newFields.description);
}, {deep: true});

</script>

<template>
  <v-container>
    <v-form @submit.prevent ref="form">
      <v-row no no-gutters>
        <v-col cols="10" class="pr-5">
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
              clearable
          />
        </v-col>
        <v-col>
          <v-text-field
              clearable
              label="Beschreibung der Lektion"
              variant="outlined"
              v-model="fields.description"
          ></v-text-field>
        </v-col>
      </v-row>
      <v-row no-gutters>
        <v-col cols="10">
          <div
              :ref="drop"
              class="container"
              :style="{borderColor: isActive ? themeColors.success : themeColors.primary}"
          >
            <v-container class="scrollcontainer">
              <v-container v-if="components">
                <v-row v-for="componentEntry in components">
                  <v-col cols="1" align-self="center" class="d-flex flex-column">
                    <v-btn v-if="lessonFormStore.getComponentIndexById(componentEntry.id) > 0"
                           class="ma-2"
                           icon="mdi-arrow-up"
                           @click="lessonFormStore.switchComponentWithPrevById(componentEntry.id)"
                    ></v-btn>
                    <v-btn
                        class="ma-2"
                        icon="mdi-delete"
                        @click="lessonFormStore.removeComponentById(componentEntry.id)"
                    ></v-btn>
                    <v-btn v-if="lessonFormStore.getComponentIndexById(componentEntry.id) !== components.length-1"
                           class="ma-2"
                           icon="mdi-arrow-down"
                           @click="lessonFormStore.switchComponentWithPostById(componentEntry.id)"
                    ></v-btn>
                  </v-col>
                  <v-col cols="11">
                    <v-sheet rounded class="pa-3">
                      <component
                          :is="getComponentInstance(componentEntry.type)"
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
        <v-col cols="2">
          <v-container>
            <v-sheet elevation="0" border rounded>
              <v-container>
                <v-row>
                  <v-col v-for="template in templates" :key="template">
                    <LessonModuleBox :title="template"/>
                  </v-col>
                </v-row>
              </v-container>
            </v-sheet>
          </v-container>
          <v-container>
            <v-row>
              <v-col>
                <v-btn
                    color="error"
                    @click="lessonFormStore.clearComponents()"
                    block
                >
                  Reset
                </v-btn>
              </v-col>
              <v-col>
                <v-btn
                    color="primary"
                    @click="uploadLesson()"
                    block
                >
                  Speichern
                </v-btn>
              </v-col>
            </v-row>
          </v-container>
        </v-col>
      </v-row>
    </v-form>
  </v-container>
</template>

<style scoped>

.scrollcontainer {
  overflow-y: auto;
  max-height: 70vh;
}

.container {
  display: flex;
  border: 1px solid;
  border-radius: 5px;
  align-items: center;
  justify-content: center;
  text-align: center;
  min-height: 700px;
  height: 70vh;
}
</style>
