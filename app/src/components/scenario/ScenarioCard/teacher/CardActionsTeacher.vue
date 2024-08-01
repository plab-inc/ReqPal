<template>
  <div v-if="scenario">
    <v-row no-gutters justify="center">
      <v-btn color="info" text="Bearbeiten" @click="editScenario(scenario)" />
      <v-btn color=success variant='outlined' :disabled="scenario.deployed && !scenario.edited"
             :text=editedDeployedCheck(scenario) @click="deployScenario(scenario)" />
      <v-btn :color="!scenario?.locked ? 'red' : 'warning'" :text="scenario?.locked ? 'Entsperren' : 'Sperren'"
             @click="lockScenario(scenario)" />
      <v-btn color="error" text="Löschen" @click="deleteScenario(scenario)" />
    </v-row>
  </div>
  <div v-else>
    <v-row no-gutters>
      <v-btn block variant="elevated" text="Neues Szenario Erstellen" @click="newScenario()" />
    </v-row>
  </div>
</template>
<script setup lang="ts">
import { defineProps } from "vue";
import { Scenario } from "@/types/scenario.ts";
import router from "@/router/index.ts";
import ScenarioService from "@/services/database/scenario.ts";
import {
  DeleteScenario,
  DeployScenarioFirstTime,
  DeployScenarioNewVersion,
  LockScenario,
  UnlockScenario
} from "@/utils/dialogs.ts";
import { useScenarioStore } from "@/stores/scenario.ts";
import { useScenarioModelerStore } from "@/stores/scenarioModeler.ts";
import { useUtilStore } from "@/stores/util.ts";

const props = defineProps<{
  scenario?: Scenario
}>();

const scenarioStore = useScenarioStore();
const scenarioModelerStore = useScenarioModelerStore();
const utilStore = useUtilStore();

const editedDeployedCheck = (scenario: Scenario) => {
  if (!scenario.deployed && scenario.edited) {
    return "Veröffentlichen";
  }
  if (scenario.version && scenario.deployed && scenario.edited) {
    return `Version ${scenario.version + 1} Veröffentlichen`;
  }
  if (scenario.deployed && !scenario.edited) {
    return "Veröffentlicht";
  }
};

const editScenario = (scenario: Scenario) => {
  scenarioModelerStore.hydrate(scenario).then(() => {
    router.push({ path: "/scenario/builder" });
  });
};

const deleteScenario = async (scenario: Scenario) => {
  utilStore.openDialog(DeleteScenario, async () => {
    utilStore.startLoadingBar();
    await scenarioStore.deleteScenario(scenario).finally(() => utilStore.stopLoadingBar());
    utilStore.addAlert("Szenario erfolgreich gelöscht.", "info");
    utilStore.stopLoadingBar();
  });
};

const lockScenario = (scenario: Scenario) => {
  if (!scenario.locked) utilStore.openDialog(LockScenario, () => {
    ScenarioService.push.toggleField(scenario, "locked");
    scenario.locked = !scenario.locked;
  });
  if (scenario.locked) utilStore.openDialog(UnlockScenario, () => {
    ScenarioService.push.toggleField(scenario, "locked");
    scenario.locked = !scenario.locked;
  });
};

const deployScenario = (scenario: Scenario) => {
  if (!scenario.deployed) utilStore.openDialog(DeployScenarioFirstTime, async () => {
    utilStore.startLoadingBar();
    await scenarioStore.deployScenario(scenario).finally(() => utilStore.stopLoadingBar());
    utilStore.addAlert("Szenario erfolgreich veröffentlicht.", "info");
  });

  if (scenario.deployed && scenario.edited) utilStore.openDialog(DeployScenarioNewVersion, async () => {
    utilStore.startLoadingBar();
    await scenarioStore.deployScenario(scenario).finally(() => utilStore.stopLoadingBar());
    utilStore.addAlert("Neue Version des Szenarios erfolgreich veröffentlicht.", "info");
    utilStore.stopLoadingBar();
  });
};

const newScenario = () => {
  scenarioModelerStore.generateNewUUID();
  scenarioModelerStore.flushScenarioData().then(() => {
    router.push({ path: "/scenario/builder" });
  });
};
</script>