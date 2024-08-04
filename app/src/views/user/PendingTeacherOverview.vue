<template>
  <v-row justify="space-between" align="center" class="mb-1">
    <v-col cols="auto" class="text-h4">
      Dozent Anfragen
    </v-col>
  </v-row>
  <v-divider/>
  <v-container>
    <v-row>
      <v-data-table-virtual
          class="mt-5"
          :headers="headers"
          :items="teacherRequestStore.getRequests.length > 0 ? teacherRequestStore.getRequests : []"
          item-value="id"
          hover
          height="70vh"
          no-data-text="Es gibt derzeit keine offenen Dozenten-Anfragen."
      >
        <template v-slot:item.actions="{ item }">
          <div>
            <v-btn
                v-if="!item.approved"
                class="ml-1"
                density="compact"
                color="success"
                variant="plain"
                size="medium"
                icon="mdi-check-circle-outline"
                @click.stop="approveTeacherRequest(item.id)"
            />
            <v-btn
                class="ml-2"
                density="compact"
                color="error"
                variant="plain"
                size="medium"
                icon="mdi-delete"
                @click.stop="deleteTeacherRequest(item.id)"
            />
          </div>
        </template>
      </v-data-table-virtual>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import {useTeacherRequestStore} from "@/stores/teacherRequest.ts";
import {ref} from "vue";
import {ApproveTeacherRequest, DeleteTeacherRequest} from "@/utils/dialogs.ts";
import {useUtilStore} from "@/stores/util.ts";
import AlertService from "@/services/util/alert.ts";

const teacherRequestStore = useTeacherRequestStore();
const utilStore = useUtilStore();

const headers = ref([
  {title: "Nutzername", value: "username", sortable: true, width: "25%", align: "start"},
  {title: "Rolle", value: "role", sortable: true, width: "auto", align: "center"},
  {title: "Approved", value: "approved", sortable: true, width: "auto", align: "center"},
  {title: "Aktionen", value: "actions", sortable: false, width: "auto", align: "end"}
] as const);

function approveTeacherRequest(requestId: string) {
  try {
    utilStore.openDialog(ApproveTeacherRequest, async () => {
      await teacherRequestStore.setApprovedStatusForRequest(requestId, true);
      AlertService.addSuccessAlert("Dozent Anfrage wurde freigegeben.");
    });
  } catch (error: any) {
    throw error;
  }
}

function deleteTeacherRequest(requestId: string) {
  try {
    utilStore.openDialog(DeleteTeacherRequest, async () => {
      await teacherRequestStore.deleteTeacherRequest(requestId);
      AlertService.addSuccessAlert("Dozent Anfrage wurde gelöscht.")
    });
  } catch (error: any) {
    throw error;
  }
}

</script>
