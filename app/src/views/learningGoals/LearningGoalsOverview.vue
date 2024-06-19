<template>
  <v-row justify="space-between" align="center" class="mb-1">
    <v-col cols="auto" class="text-h4">
      Meine Lernziele ({{ learningGoalsStore.learningGoals.length }}/{{ MAX_LEARNING_GOALS }})
    </v-col>
    <v-col cols="auto">
      <v-btn-group
          elevation="3"
          variant="outlined"
          rounded
          divided
      >
        <v-btn
            @click="createLearningGoal"
            :disabled="learningGoalsStore.learningGoals.length >= MAX_LEARNING_GOALS"
        >
          Neues Lernziel erstellen
        </v-btn>
      </v-btn-group>
    </v-col>
  </v-row>
  <v-divider/>
  <v-container>
    <v-row>
      <LearningGoalsTable/>
    </v-row>
  </v-container>
  <EditLearningGoal v-if="editDialog" :dialog="editDialog" @update:dialog="updateEditDialog"></EditLearningGoal>
</template>

<script setup lang="ts">
import {useAuthStore} from "@/stores/auth.ts";
import {ref} from "vue";
import LearningGoalsTable from "@/components/learningGoals/LearningGoalsTable.vue";
import EditLearningGoal from "@/components/learningGoals/EditLearningGoal.vue";
import {useLearningGoalsStore} from "@/stores/learningGoals.ts";

const MAX_LEARNING_GOALS = 5;
const learningGoalsStore = useLearningGoalsStore();
const authStore = useAuthStore();
const editDialog = ref<boolean>(false);

function updateEditDialog(value: boolean) {
  editDialog.value = value;
}

async function createLearningGoal() {
  if (authStore.user?.id) {
    learningGoalsStore.currentLearningGoal = null;
    editDialog.value = true;
  }
}
</script>
