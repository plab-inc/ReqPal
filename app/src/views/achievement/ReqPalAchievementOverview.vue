<template>
  <v-row justify="space-between" align="center" class="mb-1">
    <v-col cols="auto" class="text-h4">
      ReqPal-Achievements ({{ achievementStore.reqPalAchievements.length }})
    </v-col>
    <v-col cols="auto">
      <v-btn-group
          elevation="3"
          variant="outlined"
          rounded
          divided
      >
        <v-btn color="info" text="Hinweise" @click="utilStore.openDialog(ReqPalHint)" />
        <v-btn
            @click="createAchievement"
        >
          Neues ReqPal-Achievement erstellen
        </v-btn>
      </v-btn-group>
    </v-col>
  </v-row>
  <v-divider/>
  <v-container>
    <v-row>
      <ReqPalAchievementTable/>
    </v-row>
  </v-container>
  <EditReqPalAchievement v-if="editDialog" :dialog="editDialog" @update:dialog="updateEditDialog"></EditReqPalAchievement>
</template>

<script setup lang="ts">
import {useAuthStore} from "@/stores/auth.ts";
import {ref} from "vue";
import {useAchievementStore} from "@/stores/achievement.ts";
import ReqPalAchievementTable from "@/components/achievement/ReqPalAchievementTable.vue";
import EditReqPalAchievement from "@/components/achievement/EditReqPalAchievement.vue";
import {useUtilStore} from "@/stores/util.ts";
import {ReqPalHint} from "@/utils/dialogs.ts";

const achievementStore = useAchievementStore();
const authStore = useAuthStore();
const utilStore = useUtilStore();
const editDialog = ref<boolean>(false);

function updateEditDialog(value: boolean) {
  editDialog.value = value;
}

async function createAchievement() {
  if (authStore.user?.id) {
    achievementStore.reqPalAchievement = null;
    editDialog.value = true;
  }
}
</script>
