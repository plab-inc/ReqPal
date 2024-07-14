<template>
  <v-dialog
      :model-value="dialog"
      @update:model-value="close"
      opacity="0.3"
      max-width="900"
  >
    <v-form v-model="isFormValid" @submit.prevent="save" ref="form">
      <v-card variant="elevated" class="pa-1">
        <v-card-title v-if="localObjective.id.length > 0">Lernziel bearbeiten</v-card-title>
        <v-card-title v-if="localObjective.id.length <= 0">Lernziel erstellen</v-card-title>
        <v-card-text>
          <v-row>
            <v-col>
              <div class="text-caption mb-2">
                Lernziel
              </div>
              <v-text-field variant="outlined" label="Name" v-model="localObjective.name"
                            :rules="[requiredStringRule]"/>
              <v-text-field variant="outlined" label="Beschreibung" v-model="localObjective.description"
                            :rules="[requiredStringRule, maxLengthRule]"/>
              <v-text-field variant="outlined" label="Maximales Level" type="number" v-model="localObjective.max_level"
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
import {useObjectiveStore} from "@/stores/objective.ts";
import {Objective} from "@/types/objective.ts";

interface Props {
  dialog: boolean;
}

defineProps<Props>();
const emit = defineEmits(["update:dialog"]);
const objectiveStore = useObjectiveStore();
const isFormValid = ref<boolean>(false);
const localObjective = ref<Objective>({id: "", name: "", description: "", max_level: 5});
const originalObjective = ref<Objective>();

function close() {
  emit("update:dialog", false);
}

async function save() {
  if (originalObjective.value && localObjective.value) {
    if (!areObjectivesEqual(originalObjective.value, localObjective.value)) {
      await updateObjective();
    } else {
      AlertService.addInfoAlert("Es wurden keine Änderungen vorgenommen.")
      return;
    }
  } else if (!originalObjective.value && localObjective.value) {
    await createObjective();
  }

  emit("update:dialog", false);
}

async function updateObjective() {
  try {
    await objectiveStore.updateCurrentObjective(localObjective.value);
    AlertService.addSuccessAlert("Lernziel wurde aktualisiert.")
  } catch (error: any) {
    throw error;
  }
}

async function createObjective() {
  try {
    await objectiveStore.uploadObjective(localObjective.value);
    AlertService.addSuccessAlert("Lernziel wurde erstellt.")
  } catch (error: any) {
    throw error;
  }
}

function areObjectivesEqual(original: Objective, edited: Objective) {
  return JSON.stringify(original) === JSON.stringify(edited);
}

onBeforeMount(async () => {
  if (objectiveStore.getCurrentObjective) {
    originalObjective.value = objectiveStore.getCurrentObjective;
    localObjective.value = JSON.parse(JSON.stringify(originalObjective.value));
  }
});
</script>
