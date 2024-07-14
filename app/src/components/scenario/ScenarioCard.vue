<template>
  <v-card
    variant="outlined"
    width="550"
    class="ma-3"
    rounded
    elevation="10"
  >
    <div :style="scenario?.locked ? 'opacity: 0.3': 'opacity: 1' " v-html="scenario ? scenario.svg : scenarioModelerStore.baseDiagramSvg" class="svg-container elevation-5"/>
    <div class="elevation-8">
      <v-card-title class="text-h4 pb-0">
        {{ scenario ? scenario.title : 'Leeres Szenario' }}
      </v-card-title>
      <v-card-subtitle :class="scenario?.locked ? 'text-red': 'text-success'">
        {{ scenario ? scenario.locked ? 'Gesperrt': 'Zur Bearbeitung freigegeben' : '&nbsp;' }}
      </v-card-subtitle>
      <v-card-text style="height: 60px; overflow: hidden" >
        {{ scenario ? scenario.description : 'Hier können Sie ein neues Szenario erstellen. Bitte lesen Sie die Hinweise im Modellierer sorgfältig durch, um sicherzustellen, dass Sie alle notwendigen Konventionen berücksichtigen.' }}
      </v-card-text>

      <v-card-actions>
        <v-container class="pa-0 align-content-end" style="height: 75px">
          <div v-if="scenario">
            <v-row no-gutters justify="center">
              <v-btn color="info" text="Bearbeiten" @click="editScenario(scenario)"/>
              <v-btn :variant="scenario?.deployed ? 'outlined' : 'plain'" color=success :text="scenario?.deployed ? 'Veröffentlicht' : 'Veröffentlichen'" @click="deployScenario(scenario)"/>
              <v-btn :color="scenario?.locked ? 'success' : 'warning'" :text="scenario?.locked ? 'Entsperren' : 'Seprren'" @click="lockScenario(scenario)"/>
              <v-btn color="error" text="Löschen" @click="deleteScenario(scenario)"/>
            </v-row>
            <v-row no-gutters>
              <v-btn block :append-icon="show ? 'mdi-chevron-up' : 'mdi-chevron-down'" text="Statistiken"  @click="show = !show" />
            </v-row>
          </div>
          <div v-else>
            <v-row no-gutters>
              <v-btn block variant="elevated" text="Neues Szenario Erstellen" @click="newScenario()"/>
            </v-row>
          </div>
        </v-container>
      </v-card-actions>
    </div>

    <v-expand-transition>
      <div v-show="show">
        <v-card-text>
          <v-chip-group variant="outlined" selected-class="bg-deep-purple-lighten-2" column>
            <v-chip>All Versions</v-chip>
            <v-chip>Version 1</v-chip>
          </v-chip-group>
          <v-spacer/>
          <v-progress-linear
            bg-color="surface-variant"
            class="my-2"
            color="error"
            disabled
            height="10"
            model-value="100"
            rounded="pill"
          />
          <div>0 of 100 Students finished this scenario</div>
          <v-spacer class="my-2"/>
          <v-btn disabled variant="outlined" block text="Detailierte Ergebnisse"/>
        </v-card-text>
      </div>
    </v-expand-transition>
  </v-card>
</template>

<script setup lang="ts">
import { ref, defineProps } from 'vue';
import { Scenario, ScenarioDTO } from "@/types/scenario.ts";
import router from "@/router/index.ts";
import { useScenarioModelerStore } from "@/stores/scenarioModeler.ts";
import ScenarioService from "@/services/database/scenario.ts";
import { useScenarioStore } from "@/stores/scenario.ts";
import { BpmnStorageService } from "@/services/storage/bpmn.ts";

const props = defineProps<{
  scenario?: Scenario
}>();

const show = ref<boolean>(false);
const scenarioModelerStore = useScenarioModelerStore();
const scenarioStore = useScenarioStore();

const editScenario = (scenario: Scenario) => {
  scenarioModelerStore.hydrate(scenario).then(() => {
    router.push({path: '/scenario/builder'});
  });
}

const deleteScenario = async (scenario: Scenario) => {
  //TODO Logic to handle deleted Scenarios
  await ScenarioService.push.deleteScenario(scenario).then((scenarioDTO: ScenarioDTO | undefined) => {
    if(scenarioDTO){
      scenarioStore.getScenarios.splice(scenarioStore.getScenarios.findIndex(s => s.id === scenarioDTO.id), 1);
      BpmnStorageService.push.manageScenarioAssets(scenario, 'delete')
    }
  })
}

const lockScenario = (scenario: Scenario) => {
  //TODO Logic to handle locked Scenarios
  ScenarioService.push.toggleField(scenario,'locked');
  scenario.locked = !scenario.locked
}

const deployScenario = (scenario: Scenario) => {
  //TODO Logic to deploy Scenarios
  ScenarioService.push.toggleField(scenario,'deployed');
  scenario.deployed = !scenario.deployed
}

const newScenario = () => {
  scenarioModelerStore.flushScenario().then(() => {
    router.push({path: '/scenario/builder'});
  });
}

</script>

<style scoped>
.svg-container {
  display: flex;
  height: 200px;
  background: white;
  overflow: hidden;
  justify-content: center;
  align-items: center;
  padding: 16px;
}
</style>
