<template>
  <v-row justify="space-between" align="center" class="mb-1">
    <v-col cols="auto" class="text-h4">
      {{ scenarioModelerStore.isDirty ? "Szenario bearbeiten" : "Neues Szenario erstellen" }}
    </v-col>
    <v-col cols="auto">
      <v-btn-group
        elevation="3"
        variant="outlined"
        rounded
        divided
      >
        <v-btn color="info" text="Hinweise" @click="utilStore.openDialog(BPMNHint)" />
        <v-btn color="error" text="Zurücksetzen" @click="resetScenario()"/>
        <v-btn color="success" text="Szenario Speichern" @click="saveScenario()"/>
      </v-btn-group>
    </v-col>
  </v-row>
  <v-divider></v-divider>
  <v-container>
    <v-form @submit.prevent ref="form" v-model="formIsValid">
      <v-row no-gutters>
        <v-col cols="12">
          <v-text-field
            clearable
            density="compact"
            v-model="scenarioModelerStore.title"
            :rules="[requiredStringRule, requiredUniqueScenarioTitleRule]"
            label="Titel des Szenarios"
            variant="outlined"
          ></v-text-field>
          <v-textarea
            density="compact"
            rows="2"
            v-model="scenarioModelerStore.description"
            label="Beschreibung des Szenarios"
            :rules="[requiredStringRule]"
            variant="outlined"
          ></v-textarea>
        </v-col>
      </v-row>
      <v-row no-gutters>
        <v-col cols="12">
          <v-card :border="scenarioModelerStore.modelerWarning ? 'error lg' : 'white lg'" class="border-opacity-100"
                  rounded>
            <Modeler ref="modelerRef"/>
          </v-card>
        </v-col>
      </v-row>
    </v-form>
  </v-container>
</template>

<script setup lang="ts">
import Modeler from "@/components/scenario/ScenarioModeler.vue";
import { requiredStringRule, requiredUniqueScenarioTitleRule } from "@/utils/validationRules.ts";
import { useScenarioModelerStore } from "@/stores/scenarioModeler.ts";
import { ref } from "vue";
import router from "@/router/index.ts";
import { useUtilStore } from "@/stores/util.ts";
import { BPMNHint } from "@/utils/dialogs.ts";

const scenarioModelerStore = useScenarioModelerStore();
const utilStore = useUtilStore();

const form = ref<any>(null);
const formIsValid = ref(false);

async function validate() {
  await form.value.validate();
}

async function resetScenario() {
  await scenarioModelerStore.flushScenarioData();
  await scenarioModelerStore.loadInDiagram();
}

async function saveScenario(){
  await validate();

  if (!formIsValid.value) {
    return;
  }

  utilStore.startLoadingBar();
  await scenarioModelerStore.saveScenario().then(() => {
    router.push({path: '/scenario'});
  }).finally(() => utilStore.stopLoadingBar());
}
</script>