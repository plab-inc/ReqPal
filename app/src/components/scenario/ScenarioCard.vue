<template>
  <v-card
    variant="outlined"
    width="500"
    class="ma-3"
    rounded
    elevation="10"
  >
    <div v-html="scenario ? scenario.svg : scenarioModelerStore.baseDiagramSvg" class="svg-container elevation-5"/>
    <div class="elevation-8">
      <v-card-title class="text-h4">
        {{ scenario ? scenario.title : 'Leeres Szenario' }}
      </v-card-title>
      <v-card-text style="height: 60px; overflow: hidden" >
        {{ scenario ? scenario.description : 'Hier können Sie ein neues Szenario erstellen. Bitte lesen Sie die Hinweise im Modellierer sorgfältig durch, um sicherzustellen, dass Sie alle notwendigen Konventionen berücksichtigen.' }}
      </v-card-text>

      <v-card-actions>
        <v-container class="pa-0 align-content-end" style="height: 75px">
          <div v-if="scenario">
            <v-row no-gutters justify="center">
              <v-btn color="info" text="Bearbeiten" @click="editScenario(scenario)"/>
              <v-btn disabled :color="scenario?.deployed ? 'success' : 'grey'" text="Veröffentlichen"/>
              <v-btn disabled :color="scenario?.locked ? 'warning' : 'grey'" text="Sperren"/>
              <v-btn disabled color="error" text="Löschen"/>
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
import { Scenario } from "@/types/scenario.ts";
import router from "@/router/index.ts";
import { useScenarioModelerStore } from "@/stores/scenarioModeler.ts";

const props = defineProps<{
  scenario?: Scenario
}>();

const show = ref<boolean>(false);
const scenarioModelerStore = useScenarioModelerStore();

const editScenario = (scenario: Scenario) => {
  scenarioModelerStore.hydrate(scenario).then(() => {
    router.push({path: '/scenario/builder'});
  });
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
