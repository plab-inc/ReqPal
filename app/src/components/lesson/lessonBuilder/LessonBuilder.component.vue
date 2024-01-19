<script setup lang="ts">
import {DropTargetMonitor, useDrop} from 'vue3-dnd';
import {DragItemTypes} from '@/types/dragItem.types.ts';
import {toRefs} from '@vueuse/core';
import {useTheme} from "vuetify";
import {useLessonFormStore} from "@/stores/lessonForm.store.ts";
import {LessonBuilderDragItem} from "@/types/drag.types.ts";
import {requiredStringRule, requiredUniqueLessonTitleRule} from "@/utils/validationRules.ts";
import TrueOrFalse from "@/components/lesson/lessonForms/TrueOrFalseForm.component.vue";
import MultipleChoiceForm from "@/components/lesson/lessonForms/MultipleChoiceForm.component.vue";
import SliderForm from "@/components/lesson/lessonForms/SliderForm.component.vue";
import TextfieldForm from "@/components/lesson/lessonForms/TextfieldForm.component.vue";
import CatalogRequirementSelection from "@/components/lesson/lessonForms/CatalogRequirementSelectionForm.component.vue"
import NotesForm from "@/components/lesson/lessonForms/NotesForm.component.vue";
import LessonModuleBox from "@/components/lesson/lessonBuilder/LessonModuleBox.component.vue";
import Divider from "@/components/lesson/lessonForms/DividerForm.component.vue";
import LessonService from "@/services/database/lesson.service.ts";
import router from "@/router";
import {useUtilStore} from "@/stores/util.store.ts";
import {useLessonStore} from "@/stores/lesson.store.ts";
import alertService from "@/services/util/alert.service.ts";

interface ComponentsMap {
  [key: string]: Component;
}

const props = defineProps<{
  showToolTip: boolean
}>();

const themeColors = useTheme().current.value.colors;
const templates = ['Requirement', 'TrueOrFalse', 'MultipleChoice', 'Textfield', 'Note', 'Slider', 'Divider']

const componentsMap: ComponentsMap = {
  'TrueOrFalse': markRaw(TrueOrFalse),
  'Requirement': markRaw(CatalogRequirementSelection),
  'MultipleChoice': markRaw(MultipleChoiceForm),
  'Slider': markRaw(SliderForm),
  'Textfield': markRaw(TextfieldForm),
  'Note': markRaw(NotesForm),
  'Divider': markRaw(Divider)
};

const lessonFormStore = useLessonFormStore();
const lessonStore = useLessonStore();
const utilStore = useUtilStore();

const MAX_LESSONS: number = 20;
const MAX_QUESTIONS: number = 20;

const getComponentInstance = (componentName: string): Component => {
  return componentsMap[componentName];
};

const [collect, drop] = useDrop(() => ({
  accept: DragItemTypes.COMPONENT,
  drop: (item: LessonBuilderDragItem) => {
    if (components.length < MAX_QUESTIONS) {
      lessonFormStore.addComponent(item.name);
      return;
    }
    utilStore.addAlert('Die maximale Anzahl von Lernmodulen pro Lektion wurde erreicht', 'info');
  },

  hover: (item: object, monitor: DropTargetMonitor) => {
      console.log(monitor.getClientOffset());
  },
  collect: monitor => ({
    isOver: monitor.isOver(),
    canDrop: (monitor.canDrop() && components.length < MAX_QUESTIONS),
  }),
}));


const isActive = computed(() => unref(canDrop) && unref(isOver));
const form = ref<any>(null);
const formIsValid = ref(false);
const components = lessonFormStore.getComponents;
const lessons = lessonStore.getLessons;
const {canDrop, isOver} = toRefs(collect);


async function validate() {
  await form.value.validate();
}

async function uploadLesson() {
  await validate();

  if (!formIsValid.value) {
    return;
  }

  if (components.length < MAX_QUESTIONS && lessons.length < MAX_LESSONS) {

    let lesson = lessonFormStore.generateLesson();
    await LessonService.push.uploadLesson(lesson)
        .catch(() => {
          utilStore.addAlert('Fehler beim Speichern der Lektion', 'error');
        }).then(async () => {
          utilStore.addAlert('Lektion erfolgreich gespeichert', 'success');
          await router.push({path: '/lessons'});
          lessonFormStore.flushStore();
        });

    return;
  }
  throw new Error('Die Lektion konnte nicht erstellt werden');
}

function openDeleteDialog(componentUUID: string) {
  alertService.openDialog(
      "Modul löschen",
      "Möchtest du dieses Modul wirklich löschen? Das Löschen ist unwiderruflich",
      "Ja",
      "Nein",
      () => lessonFormStore.removeComponentById(componentUUID)
  )
}

</script>

<template>
  <v-container>
    <v-form @submit.prevent ref="form" v-model="formIsValid">
      <v-row no-gutters>
        <v-col cols="10" class="pr-5">
          <v-text-field
              clearable
              :rules="[requiredStringRule, requiredUniqueLessonTitleRule]"
              label="Titel der Lektion"
              variant="outlined"
              v-model="lessonFormStore.lessonTitle"
          ></v-text-field>
        </v-col>
        <v-col cols="2">
          <v-text-field
              label="Punktzahl bei Abschluss"
              variant="outlined"
              type="number"
              v-model="lessonFormStore.lessonPoints"
              clearable
          />
        </v-col>
        <v-col>
          <v-text-field
              clearable
              label="Beschreibung der Lektion"
              :rules="[requiredStringRule]"
              variant="outlined"
              v-model="lessonFormStore.lessonDescription"
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
                    <v-btn v-if="lessonFormStore.getComponentIndexById(componentEntry.uuid) > 0"
                           class="ma-2"
                           icon="mdi-arrow-up"
                           @click="lessonFormStore.switchComponentWithPrevById(componentEntry.uuid)"
                    ></v-btn>
                    <v-btn
                        class="ma-2"
                        icon="mdi-delete"
                        @click="openDeleteDialog(componentEntry.uuid)"
                    ></v-btn>
                    <v-btn v-if="lessonFormStore.getComponentIndexById(componentEntry.uuid) !== components.length-1"
                           class="ma-2"
                           icon="mdi-arrow-down"
                           @click="lessonFormStore.switchComponentWithPostById(componentEntry.uuid)"
                    ></v-btn>
                  </v-col>
                  <v-col cols="11">
                    <v-sheet rounded class="pa-3">
                      <component v-if="componentEntry.type"
                                 :is="getComponentInstance(componentEntry.type)"
                                 :key="componentEntry.uuid"
                                 :componentId="componentEntry.uuid"
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
          <v-card
              class="ml-5"
              variant="outlined"
              color="primary"
          >
            <v-col v-for="template in templates" :key="template">
              <LessonModuleBox :title="template" :show-tool-tip="showToolTip" :key="template"/>
            </v-col>
          </v-card>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="auto">
          <v-card
              variant="outlined"
              color="primary"
          >
            <v-btn-group
                variant="outlined"
                divided
                elevation="5"
            >
              <v-btn
                  color="error"
                  @click="lessonFormStore.flushStore()"
              >
                Lektion zurücksetzen
              </v-btn>
              <v-btn
                  color="error"
                  @click="lessonFormStore.clearComponents()"
              >
                Module zurücksetzen
              </v-btn>
              <v-btn
                  :disabled="formIsValid"
                  variant="outlined"
                  color="info"
                  @click="validate()"
              >
                Lektion Validieren
              </v-btn>
              <v-btn
                  :variant="(formIsValid && components.length > 0) ? 'elevated' : 'outlined'"
                  color="primary"
                  :disabled="!(formIsValid && components.length > 0 && components.length < MAX_QUESTIONS && lessons.length < MAX_LESSONS)"
                  @click="uploadLesson()"
              >
                Lektion Speichern
              </v-btn>
            </v-btn-group>
          </v-card>
        </v-col>
      </v-row>
    </v-form>
  </v-container>
</template>

<style scoped>

.scrollcontainer {
  overflow-y: auto;
  max-height: 69vh;
}

.container {
  display: flex;
  border: 1px solid;
  border-radius: 5px;
  align-items: center;
  justify-content: center;
  text-align: center;
  min-height: 70vh;
  height: 70vh;
}
</style>
