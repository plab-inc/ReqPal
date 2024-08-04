<template>
  <v-row justify="space-between" align="center" class="mb-1">
    <v-col cols="auto" class="text-h4">
      Meine Achievements ({{ achievementStore.achievements.length }}/{{ MAX_ACHIEVEMENTS }})
    </v-col>
    <v-col cols="auto">
      <v-btn-group
          elevation="3"
          variant="outlined"
          rounded
          divided
      >
        <v-btn
            @click="createAchievement"
            :disabled="achievementStore.achievements.length >= MAX_ACHIEVEMENTS"
        >
          Neues Achievement erstellen
        </v-btn>
      </v-btn-group>
    </v-col>
  </v-row>
  <v-divider/>
  <v-container>
    <v-row>
      <AchievementTable/>
    </v-row>
  </v-container>
  <EditAchievement v-if="editDialog" :dialog="editDialog" @update:dialog="updateEditDialog"></EditAchievement>
</template>

<script setup lang="ts">
import {useAuthStore} from "@/stores/auth.ts";
import {ref} from "vue";
import {useAchievementStore} from "@/stores/achievement.ts";
import AchievementTable from "@/components/achievement/AchievementTable.vue";
import EditAchievement from "@/components/achievement/EditAchievement.vue";

const MAX_ACHIEVEMENTS = 20;
const achievementStore = useAchievementStore();
const authStore = useAuthStore();
const editDialog = ref<boolean>(false);

function updateEditDialog(value: boolean) {
  editDialog.value = value;
}

async function createAchievement() {
  if (authStore.user?.id) {
    achievementStore.achievement = null;
    editDialog.value = true;
  }
}
</script>
