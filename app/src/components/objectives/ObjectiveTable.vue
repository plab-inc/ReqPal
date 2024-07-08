<template>
  <v-data-table-virtual
      class="mt-5"
      v-model:expanded="expanded"
      :headers="headers"
      :items="objectiveStore.getCurrentObjectives ? objectiveStore.getCurrentObjectives : []"
      item-value="id"
      hover
      height="70vh"
      no-data-text="Sie haben noch keine Lernziele erstellt."
  >
    <template v-slot:item.actions="{ item }">
      <div>
        <v-btn
            class="ml-1"
            density="compact"
            color="success"
            variant="plain"
            size="medium"
            icon="mdi-pencil"
            @click.stop="openEditDialog(item)"
        />
        <v-btn
            class="ml-2"
            density="compact"
            color="error"
            variant="plain"
            size="medium"
            icon="mdi-delete"
            @click.stop="deleteObjective(item)"
        />
      </div>
    </template>
  </v-data-table-virtual>
  <EditObjective v-if="editDialog" :dialog="editDialog" @update:dialog="updateEditDialog"></EditObjective>
</template>

<script setup lang="ts">
import {ref} from "vue";
import {DeleteObjective} from "@/utils/dialogs.ts";
import {useUtilStore} from "@/stores/util.ts";
import {useObjectiveStore} from "@/stores/objective.ts";
import {Objective} from "@/types/objective.ts";
import EditObjective from "@/components/objectives/EditObjective.vue";

const expanded = ref<any>([]);
const utilStore = useUtilStore();
const editDialog = ref<boolean>(false);

const objectiveStore = useObjectiveStore();

const headers = ref([
  {title: "Name", value: "name", sortable: true, width: "25%", align: "start"},
  {title: "Beschreibung", value: "description", sortable: true, width: "auto", align: "center"},
  {title: "Maximales Level", value: "max_level", sortable: true, width: "auto", align: "center"},
  {title: "Aktionen", value: "actions", sortable: false, width: "auto", align: "end"}
] as const);

function openEditDialog(item: Objective | null) {
  if (item) {
    objectiveStore.currentObjective = item;
    editDialog.value = true;
  }
}

function updateEditDialog(value: boolean) {
  editDialog.value = value;
}

function deleteObjective(item: Objective) {
  utilStore.openDialog(DeleteObjective, () => {
    objectiveStore.deleteObjectiveById(item.id);
  });
}
</script>