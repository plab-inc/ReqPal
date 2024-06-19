<template>
  <v-dialog
      :model-value="dialog"
      @update:model-value="close"
      opacity="0.3"
      max-width="900"
  >
    <v-form v-model="isFormValid" @submit.prevent="save" ref="form">
      <v-card variant="elevated" class="pa-1">
        <v-card-title v-if="localGoal.id.length > 0">Produkt bearbeiten</v-card-title>
        <v-card-title v-if="localGoal.id.length <= 0">Produkt erstellen</v-card-title>
        <v-card-text>
          <v-row>
            <v-col>
              <div class="text-caption mb-2">
                Lernziel
              </div>
              <v-text-field variant="outlined" label="Name" v-model="localGoal.name"
                            :rules="[requiredStringRule]"/>
              <v-text-field variant="outlined" label="Beschreibung" v-model="localGoal.description"
                            :rules="[requiredStringRule, maxLengthRule]"/>
              <v-text-field variant="outlined" label="Maximales Level" type="number" v-model="localGoal.max_level"
                            :rules="[requiredPositiveNumberRule]"/>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="success" type="submit"
                 :disabled="!isFormValid">Speichern
          </v-btn>
          <v-btn color="info" @click="close">Schließen</v-btn>
        </v-card-actions>
      </v-card>
    </v-form>
  </v-dialog>
</template>

<script setup lang="ts">
import { onBeforeMount, ref } from "vue";
import AlertService from "@/services/util/alert.ts";
import {
  maxLengthRule,
  requiredPositiveNumberRule,
  requiredStringRule
} from "@/utils/validationRules.ts";
import {useLearningGoalsStore} from "@/stores/learningGoals.ts";
import {LearningGoal} from "@/types/learningGoals.ts";

interface Props {
  dialog: boolean;
}

defineProps<Props>();
const emit = defineEmits(["update:dialog"]);
const learningGoalStore = useLearningGoalsStore();
const isFormValid = ref<boolean>(false);
const localGoal = ref<LearningGoal>({id: "", name: "", description: "", max_level: 5});
const originalGoal = ref<LearningGoal>();

function close() {
  emit("update:dialog", false);
}

async function save() {
  if (originalGoal.value && localGoal.value) {
    if (!areGoalsEqual(originalGoal.value, localGoal.value)) {
      await updateLearningGoal();
    } else {
      AlertService.addInfoAlert("Es wurden keine Änderungen vorgenommen.")
      return;
    }
  } else if (!originalGoal.value && localGoal.value) {
    await createLearningGoal();
  }

  emit("update:dialog", false);
}

async function updateLearningGoal() {
  try {
    await learningGoalStore.updateCurrentLearningGoal(localGoal.value);
    AlertService.addSuccessAlert("Lernziel wurde aktualisiert.")
  } catch (error: any) {
    throw error;
  }
}

async function createLearningGoal() {
  try {
    await learningGoalStore.uploadLearningGoal(localGoal.value);
    AlertService.addSuccessAlert("Lernziel wurde erstellt.")
  } catch (error: any) {
    throw error;
  }
}

function areGoalsEqual(original: LearningGoal, edited: LearningGoal) {
  return JSON.stringify(original) === JSON.stringify(edited);
}

onBeforeMount(async () => {
  if (learningGoalStore.getCurrentLearningGoal) {
    originalGoal.value = learningGoalStore.getCurrentLearningGoal;
    localGoal.value = JSON.parse(JSON.stringify(originalGoal.value));
  }
});
</script>
