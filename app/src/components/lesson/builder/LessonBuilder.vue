<template>
  <v-form @submit.prevent ref="formRef">
      <v-row no-gutters>
        <v-col>
          <v-text-field
              clearable
              density="compact"
              :rules="[requiredStringRule, requiredUniqueLessonTitleRule]"
              label="Titel der Lektion"
              variant="outlined"
              v-model="lessonFormStore.lessonTitle"
          ></v-text-field>
        </v-col>
        <v-col cols="8">
          <v-textarea
            class="mr-5"
            rows="2"
            density="compact"
              label="Beschreibung der Lektion"
              :rules="[requiredStringRule]"
              variant="outlined"
              v-model="lessonFormStore.lessonDescription"
          ></v-textarea>
        </v-col>
        <v-col cols="4">
          <v-select
              v-model="lessonFormStore.objectiveIds"
              clearable
              multiple
              chips
              :items="objectiveStore.getCurrentObjectives"
              density="comfortable"
              label="Lernziele"
              item-title="name"
              item-value="id"
              variant="outlined"
              no-data-text="Es stehen noch keine Lernziele zur Verfügung."
              :disabled="objectiveStore.getCurrentObjectives.length < 0"
          >
          </v-select>
        </v-col>
      </v-row>
      <v-row no-gutters>
        <v-col cols="10">
          <ModuleTarget>
            <v-row v-for="componentEntry in lessonFormStore.getLessonModules">
              <v-col cols="12">
                <SortableModule :id="componentEntry.uuid" :componentName="componentEntry.type"/>
              </v-col>
            </v-row>
          </ModuleTarget>
        </v-col>
        <v-col cols="2">
          <v-card variant="flat" class="position-sticky sticky-top">
            <v-card
              class="ml-3"
                variant="outlined"
                color="primary"
            >
              <v-col v-for="template in templates" :key="template" class="py-2">
                <ModulePreview :title="template" :key="template" />
              </v-col>
            </v-card>
          </v-card>
        </v-col>
      </v-row>
    </v-form>
</template>
<script setup lang="ts">
import { useLessonFormStore } from "@/stores/lessonForm.ts";
import { requiredStringRule, requiredUniqueLessonTitleRule } from "@/utils/validationRules.ts";
import ModulePreview from "@/components/lesson/builder/dragAndDrop/ModulePreviewContainer.vue";
import SortableModule from "@/components/lesson/builder/dragAndDrop/SortableModuleContainer.vue";
import ModuleTarget from "@/components/lesson/builder/dragAndDrop/ModuleTarget.vue";
import { onMounted, ref } from "vue";
import { useObjectiveStore } from "@/stores/objective.ts";
import { VForm } from "vuetify/components";

const templates = ["Requirement", "TrueOrFalse", "MultipleChoice", "Textfield", "Note", "Slider", "Divider"];

const lessonFormStore = useLessonFormStore();
const formRef = ref<VForm | null>(null);
const objectiveStore = useObjectiveStore();

onMounted(() => {
  lessonFormStore.form = formRef.value;
});

</script>
<style>
.sticky-top {
  position: sticky;
  top: 15px;
}
</style>