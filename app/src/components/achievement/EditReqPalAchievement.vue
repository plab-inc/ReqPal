<template>
  <v-dialog
      :model-value="dialog"
      @update:model-value="close"
      opacity="0.3"
      max-width="900"
  >
    <v-form v-model="isFormValid" @submit.prevent="save" ref="form">
      <v-card variant="elevated" class="pa-1">
        <v-card-title v-if="localAchievement.id.length > 0">ReqPal-Achievement bearbeiten</v-card-title>
        <v-card-title v-if="localAchievement.id.length <= 0">ReqPal-Achievement erstellen</v-card-title>
        <v-card-text>
          <div class="text-caption mb-2">
            ReqPal-Achievement
          </div>
          <v-row>
            <v-col cols="10">
              <v-text-field variant="outlined" label="Eigenes Ziel" v-model="localAchievement.target_field"
                            :rules="[requiredStringRule]"/>
            </v-col>
            <v-col cols="auto" class="d-flex justify-end">
              <v-switch
                  color="primary"
                  v-model="localAchievement.example"
                  label="Beispiel"
                  hide-details
                  inset
              ></v-switch>
            </v-col>
            <v-col>
              <v-select
                  v-model="localAchievement.target_field"
                  clearable
                  chips
                  label="Messbare Ziele aus den Statistiken"
                  :items="['total_xp', 'total_scenarios', 'total_points', 'total_levels', 'total_achievements']"
              ></v-select>
            </v-col>
            <v-col>
              <v-text-field variant="outlined" label="Beschreibung" v-model="localAchievement.description"
                            :rules="[requiredStringRule, maxLengthRule]"/>
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
import {onBeforeMount, ref} from "vue";
import AlertService from "@/services/util/alert.ts";
import {
  maxLengthRule,
  requiredStringRule, requiredSvgRule
} from "@/utils/validationRules.ts";
import {useAchievementStore} from "@/stores/achievement.ts";
import {ReqPalAchievement} from "@/types/achievement.ts";

interface Props {
  dialog: boolean;
}

defineProps<Props>();
const emit = defineEmits(["update:dialog"]);
const achievementStore = useAchievementStore();
const isFormValid = ref<boolean>(false);

const localAchievement = ref<ReqPalAchievement>({
  created_at: "",
  firstLevelImage: "",
  target_field: "",
  example: false,
  id: "", description: "", levels: []
});

const originalAchievement = ref<ReqPalAchievement>();
const form = ref<any>(null);

function close() {
  emit("update:dialog", false);
}

async function validateForm() {
  await form.value.validate();
  const allLevelsValid = localAchievement.value.levels.every(l => requiredSvgRule(l.image));
  return isFormValid && allLevelsValid;
}

async function save() {
  const isValid = await validateForm()
  if (!isValid) {
    AlertService.addErrorAlert("Das Formular ist fehlerhaft.")
    return;
  }

  if (originalAchievement.value && localAchievement.value) {
    if (!areReqPalAchievementsEqual(originalAchievement.value, localAchievement.value)) {
      await updateReqPalAchievement();
    } else {
      AlertService.addInfoAlert("Es wurden keine Änderungen vorgenommen.")
      return;
    }
  } else if (!originalAchievement.value && localAchievement.value) {
    await createReqPalAchievement();
  }

  emit("update:dialog", false);
}

async function updateReqPalAchievement() {
  try {
    await achievementStore.updateReqPalAchievement(localAchievement.value);
    AlertService.addSuccessAlert("ReqPal-Achievement wurde aktualisiert.")
  } catch (error: any) {
    throw error;
  }
}

async function createReqPalAchievement() {
  try {
    await achievementStore.uploadReqPalAchievement(localAchievement.value);
    AlertService.addSuccessAlert("ReqPal-Achievement wurde erstellt.")
  } catch (error: any) {
    throw error;
  }
}

function areReqPalAchievementsEqual(original: ReqPalAchievement, edited: ReqPalAchievement) {
  return JSON.stringify(original) === JSON.stringify(edited);
}

onBeforeMount(async () => {
  if (achievementStore.getReqPalAchievement) {
    originalAchievement.value = achievementStore.getReqPalAchievement;
    localAchievement.value = JSON.parse(JSON.stringify(originalAchievement.value));
  }
});
</script>