<script setup lang="ts">
import {useLessonFormStore} from "@/stores/lessonForm.store.ts";
import {requiredStringRule, requiredUniqueLessonTitleRule} from "@/utils/validationRules.ts";
import LessonModuleBox from "@/components/lesson/lessonBuilder/LessonModuleBox.component.vue";
import LessonService from "@/services/database/lesson.service.ts";
import router from "@/router";
import {useUtilStore} from "@/stores/util.store.ts";
import {useLessonStore} from "@/stores/lesson.store.ts";
import SortContainer from "@/components/lesson/lessonBuilder/SortableContainer.component.vue";
import LessonModuleContainer from "@/components/lesson/lessonBuilder/LessonModuleContainer.component.vue"

const props = defineProps<{
  showToolTip: boolean
}>();

const templates = ['Requirement', 'TrueOrFalse', 'MultipleChoice', 'Textfield', 'Note', 'Slider', 'Divider']

const lessonFormStore = useLessonFormStore();
const lessonStore = useLessonStore();
const utilStore = useUtilStore();

const MAX_LESSONS: number = 20;
const MAX_QUESTIONS: number = 20;

const form = ref<any>(null);
const formIsValid = ref(false);
const components = lessonFormStore.getComponents;
const lessons = lessonStore.getLessons;

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
          <LessonModuleContainer>
            <v-row v-for="componentEntry in components">
              <v-col cols="12">
                <SortContainer :id="componentEntry.uuid" :componentName="componentEntry.type"/>
              </v-col>
            </v-row>
          </LessonModuleContainer>
        </v-col>
        <v-col cols="2">
          <v-card
              class="ml-5"
              variant="outlined"
              color="primary"
          >
            <v-col v-for="template in templates" :key="template">
              <LessonModuleBox :title="template" :show-tool-tip="props.showToolTip" :key="template"/>
            </v-col>
          </v-card>
          <v-spacer class="my-1"/>
          <v-card
              class="ml-5 pa-1"
              variant="outlined"
              color="primary"
          >
            <v-btn
                block
                :variant="(formIsValid && components.length > 0) ? 'elevated' : 'outlined'"
                color="success"
                :disabled="!(formIsValid && components.length > 0 && components.length < MAX_QUESTIONS && lessons.length < MAX_LESSONS)"
                @click="uploadLesson()"
            >
              Lektion Speichern
            </v-btn>
            <v-spacer class="mt-1"/>
            <v-btn
                block
                :disabled="formIsValid"
                variant="outlined"
                color="info"
                @click="validate()"
            >
              Lektion Validieren
            </v-btn>
            <v-spacer class="mt-1"/>
            <v-btn
                block
                variant="outlined"
                color="warning"
                @click="lessonFormStore.flushStore()"
            >
              Lektion zurücksetzen
            </v-btn>
            <v-spacer class="mt-1"/>
            <v-btn
                block
                variant="outlined"
                color="warning"
                @click="lessonFormStore.clearComponents()"
            >
              Bausteine zurücksetzen
            </v-btn>
          </v-card>
        </v-col>
      </v-row>
    </v-form>
  </v-container>
</template>