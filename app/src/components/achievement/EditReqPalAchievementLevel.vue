<template>
  <v-dialog
      :model-value="dialog"
      @update:model-value="close"
      opacity="0.3"
      max-width="900"
  >
    <v-form v-model="isFormValid" @submit.prevent="save" ref="form">
      <v-card variant="elevated" class="pa-1">
        <v-card-title v-if="localAchievementLevel.id.length > 0">ReqPal-Achievement Level bearbeiten</v-card-title>
        <v-card-title v-if="localAchievementLevel.id.length <= 0">ReqPal-Achievement Level erstellen</v-card-title>
        <v-card-text>
          <v-row>
            <v-col sm="6">
              <div class="text-caption mb-2">
                ReqPal-Achievement Level
              </div>
              <v-text-field variant="outlined" label="Titel" v-model="localAchievementLevel.title"
                            :rules="[requiredStringRule]"/>
              <v-text-field variant="outlined" label="Beschreibung" v-model="localAchievementLevel.description"
                            :rules="[requiredStringRule]"/>
              <v-text-field variant="outlined" label="Schwellenwert" v-model="localAchievementLevel.threshold"
                            :rules="[requiredNumberRule]"/>
              <v-text-field variant="outlined" label="Level" v-model="localAchievementLevel.level"
                            :rules="[requiredPositiveNumberRule]"/>
              <v-text-field variant="outlined" label="XP-Belohnung" v-model="localAchievementLevel.xp"
                            :rules="[requiredPositiveNumberRule]"/>
            </v-col>
            <v-col sm="6">
              <v-item-group label="Bild" v-model="localAchievementLevel.image" mandatory>
                <div class="text-caption mb-2">
                  Wähle ein Bild
                </div>
                <v-container class="scroll-container">
                  <v-row>
                    <v-col
                        v-for="image in achievementStore.images"
                        :key="image"
                        sm="6"
                        md="4"
                        class="d-flex justify-center"
                    >
                      <v-item :value="image" v-slot="{ toggle }">
                        <v-card
                            :color="localAchievementLevel.image === image ? 'primary' : ''"
                            variant="flat"
                            class="d-flex align-center"
                            width="100"
                            @click="toggle"
                        >
                          <v-scroll-y-transition>
                            <v-img :src="getAchievementImageUrl(image)"
                                   :alt="'ReqPal-Achievement Level Image: '+image"></v-img>
                          </v-scroll-y-transition>
                        </v-card>
                      </v-item>
                    </v-col>
                  </v-row>
                </v-container>
              </v-item-group>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="success" type="submit"
                 :disabled="!isFormValid || !(requiredSvgRule(localAchievementLevel.image) === true)">Speichern
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
  requiredNumberRule,
  requiredPositiveNumberRule,
  requiredStringRule, requiredSvgRule
} from "@/utils/validationRules.ts";
import {useAchievementStore} from "@/stores/achievement.ts";
import {ReqPalAchievementLevelDTO} from "@/types/achievement.ts";
import {getAchievementImageUrl} from "@/utils/achievementImage.ts";

interface Props {
  dialog: boolean;
}

defineProps<Props>();
const emit = defineEmits(["update:dialog"]);
const achievementStore = useAchievementStore();
const isFormValid = ref<boolean>(false);
const localAchievementLevel = ref<ReqPalAchievementLevelDTO>({
  id: "",
  description: "",
  image: "",
  level: 0,
  reqpal_achievement_id: "",
  threshold: 0,
  title: "",
  xp: 0
});
const originalAchievementLevel = ref<ReqPalAchievementLevelDTO>();
const form = ref<any>(null);

function close() {
  emit("update:dialog", false);
}

async function validateForm() {
  await form.value.validate();
  return isFormValid && (requiredSvgRule(localAchievementLevel.value.image) === true);
}

async function save() {
  const isValid = await validateForm()
  if (!isValid) {
    AlertService.addErrorAlert("Das Formular ist fehlerhaft.")
    return;
  }

  if (originalAchievementLevel.value && localAchievementLevel.value) {
    if (!areAchievementLevelsEqual(originalAchievementLevel.value, localAchievementLevel.value)) {
      await updateAchievementLevel();
    } else {
      AlertService.addInfoAlert("Es wurden keine Änderungen vorgenommen.")
      return;
    }
  } else if (!originalAchievementLevel.value && localAchievementLevel.value) {
    await createAchievementLevel();
  }

  emit("update:dialog", false);
}

async function updateAchievementLevel() {
  try {
    await achievementStore.updateReqPalAchievementLevel(localAchievementLevel.value);
    AlertService.addSuccessAlert("ReqPal-Achievement-Level wurde aktualisiert.")
  } catch (error: any) {
    throw error;
  }
}

async function createAchievementLevel() {
  try {
    const achievement = achievementStore.getReqPalAchievement;
    if (achievement) {
      localAchievementLevel.value.reqpal_achievement_id = achievement.id;
      await achievementStore.uploadReqPalAchievementLevel(localAchievementLevel.value);
      AlertService.addSuccessAlert("ReqPal-Achievement-Level wurde erstellt.")
    } else {
      AlertService.addErrorAlert("Zuordnung zum Achievement fehlgeschlagen.")
    }
  } catch (error: any) {
    throw error;
  }
}

function areAchievementLevelsEqual(original: ReqPalAchievementLevelDTO, edited: ReqPalAchievementLevelDTO) {
  return JSON.stringify(original) === JSON.stringify(edited);
}

onBeforeMount(async () => {
  if (achievementStore.getReqPalAchievementLevel) {
    originalAchievementLevel.value = achievementStore.getReqPalAchievementLevel;
    localAchievementLevel.value = JSON.parse(JSON.stringify(originalAchievementLevel.value));
  }
});
</script>

<style scoped>
.scroll-container {
  max-height: 250px;
  overflow-y: auto;
}
</style>