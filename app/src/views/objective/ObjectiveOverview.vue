<template>
  <v-row justify="space-between" align="center" class="mb-1">
    <v-col cols="auto" class="text-h4">
      Meine Lernziele ({{ objectivesStore.objectives.length }}/{{ MAX_OBJECTIVES }})
    </v-col>
    <v-col cols="auto">
      <v-btn-group
          elevation="3"
          variant="outlined"
          rounded
          divided
      >
        <v-btn color="info" text="Hinweise" @click="utilStore.openDialog(ObjectiveHint)" />
        <v-btn
            @click="createObjective"
            :disabled="objectivesStore.objectives.length >= MAX_OBJECTIVES"
        >
          Neues Lernziel erstellen
        </v-btn>
      </v-btn-group>
    </v-col>
  </v-row>
  <v-divider/>
  <v-container>
    <v-row>
      <ObjectiveTable/>
    </v-row>
  </v-container>
  <EditObjective v-if="editDialog" :dialog="editDialog" @update:dialog="updateEditDialog"></EditObjective>
</template>

<script setup lang="ts">
import {useAuthStore} from "@/stores/auth.ts";
import {ref} from "vue";
import ObjectiveTable from "@/components/objectives/ObjectiveTable.vue";
import EditObjective from "@/components/objectives/EditObjective.vue";
import {useObjectiveStore} from "@/stores/objective.ts";
import {ObjectiveHint} from "@/utils/dialogs.ts";
import {useUtilStore} from "@/stores/util.ts";

const MAX_OBJECTIVES = 5;
const objectivesStore = useObjectiveStore();
const authStore = useAuthStore();
const utilStore = useUtilStore();
const editDialog = ref<boolean>(false);

function updateEditDialog(value: boolean) {
  editDialog.value = value;
}

async function createObjective() {
  if (authStore.user?.id) {
    objectivesStore.currentObjective = null;
    editDialog.value = true;
  }
}
</script>
