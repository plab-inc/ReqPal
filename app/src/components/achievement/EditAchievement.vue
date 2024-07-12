<template>
  <v-dialog
      :model-value="dialog"
      @update:model-value="close"
      opacity="0.3"
      max-width="900"
  >
    <v-form v-model="isFormValid" @submit.prevent="save" ref="form">
      <v-card variant="elevated" class="pa-1">
        <v-card-title v-if="localAchievement.id.length > 0">Achievement bearbeiten</v-card-title>
        <v-card-title v-if="localAchievement.id.length <= 0">Achievement erstellen</v-card-title>
        <v-card-text>
          <v-row>
            <v-col>
              <div class="text-caption mb-2">
                Achievement
              </div>
              <v-text-field variant="outlined" label="Titel" v-model="localAchievement.title"
                            :rules="[requiredStringRule]"/>
              <v-text-field variant="outlined" label="Beschreibung" v-model="localAchievement.description"
                            :rules="[requiredStringRule, maxLengthRule]"/>
              <v-text-field variant="outlined" label="Bild" v-model="localAchievement.image"
                            :rules="[requiredStringRule]"/>
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
  requiredStringRule
} from "@/utils/validationRules.ts";
import {useAchievementStore} from "@/stores/achievement.ts";
import {Achievement} from "@/types/achievement.ts";

interface Props {
  dialog: boolean;
}

defineProps<Props>();
const emit = defineEmits(["update:dialog"]);
const achievementStore = useAchievementStore();
const isFormValid = ref<boolean>(false);
const localAchievement = ref<Achievement>({id: "", title: "", description: "", image: ""});
const originalAchievement = ref<Achievement>();

function close() {
  emit("update:dialog", false);
}

async function save() {
  if (originalAchievement.value && localAchievement.value) {
    if (!areAchievementsEqual(originalAchievement.value, localAchievement.value)) {
      await updateAchievement();
    } else {
      AlertService.addInfoAlert("Es wurden keine Änderungen vorgenommen.")
      return;
    }
  } else if (!originalAchievement.value && localAchievement.value) {
    await createAchievement();
  }

  emit("update:dialog", false);
}

async function updateAchievement() {
  try {
    await achievementStore.updateAchievement(localAchievement.value);
    AlertService.addSuccessAlert("Achievement wurde aktualisiert.")
  } catch (error: any) {
    throw error;
  }
}

async function createAchievement() {
  try {
    await achievementStore.uploadAchievement(localAchievement.value);
    AlertService.addSuccessAlert("Achievement wurde erstellt.")
  } catch (error: any) {
    throw error;
  }
}

function areAchievementsEqual(original: Achievement, edited: Achievement) {
  return JSON.stringify(original) === JSON.stringify(edited);
}

onBeforeMount(async () => {
  if (achievementStore.getAchievement) {
    originalAchievement.value = achievementStore.getAchievement;
    localAchievement.value = JSON.parse(JSON.stringify(originalAchievement.value));
  }
});
</script>
