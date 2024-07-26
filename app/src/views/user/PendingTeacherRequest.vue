<template>
  <v-row justify="space-between" align="center" class="mb-1">
    <v-col cols="auto" class="text-h4">
      Mein Dozent-Anfrage Status
    </v-col>
  </v-row>
  <v-divider/>
  <v-container>
    <v-row v-if="request">
      <v-col v-if="!request.approved">
        <div class="text-subtitle-1">
          <v-alert color="info" icon="mdi-school" title="Infos zum Status" text="Ihre Anfrage wird noch bearbeitet und überprüft.
          Sobald Ihre Anfrage freigegeben wurde, erhalten Sie vollen Zugriff als Dozent auf ReqPal!"></v-alert>
        </div>
      </v-col>
      <v-col v-if="request.approved">
        <div class="text-subtitle-1">
          <v-alert color="success" icon="mdi-school" title="Status aktualisiert" text="Ihre Anfrage wurde überprüft und freigegeben.
          Loggen Sie sich erneut ein, um vollen Zugriff als Dozent auf ReqPal zu erhalten!"></v-alert>
        </div>
      </v-col>
    </v-row>
    <v-row v-else>
      <v-col>
        <div>
          <v-alert color="warning" icon="mdi-school" title="Infos zum Status" text="Ihre Anfrage existiert nicht mehr. Entweder wurde Sie freigegeben und bereits gelöscht oder nicht freigegeben und gelöscht. Sie können versuchen, sich erneut einzuloggen und Ihre Rolle zu prüfen.
          Andernfalls können Sie eine neue Anfrage stellen."></v-alert>
        </div>
      </v-col>
      <v-col>
        <v-btn block @click="sendNewRequest">Neue Anfrage senden</v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import {useTeacherRequestStore} from "@/stores/teacherRequest.ts";
import AlertService from "@/services/util/alert.ts";
import {ref} from "vue";
import {TeacherRequestDTO} from "@/types/teacherRequest.ts";

const teacherRequestStore = useTeacherRequestStore();
const request = ref<TeacherRequestDTO | null>(teacherRequestStore.latestRequest)

async function sendNewRequest() {
  try {
    await teacherRequestStore.sendNewRequest();
    AlertService.addSuccessAlert("Neue Anfrage gesendet!")
  } catch (error: any) {
    throw error;
  }
}
</script>
