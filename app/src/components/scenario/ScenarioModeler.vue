<template>
  <v-theme-provider theme="light" with-background>
    <v-row no-gutters>
      <v-col cols="9">
        <div id="bpmn-container" ref="bpmnContainer" style="height: 65vh;">
          <v-tooltip text="BPMN Datei Hochladen" location="top left">
            <template v-slot:activator="{ props }">
              <v-btn
                v-bind="props"
                icon="mdi-upload"
                :rounded="false"
                color="black"
                density="comfortable"
                variant="outlined"
                style="position: absolute; bottom: 10px; left: 10px; z-index: 5"
                @click="uploadDiagram"
              />
            </template>
          </v-tooltip>
          <v-tooltip text="BPMN Datei Herunterladen" location="top left">
            <template v-slot:activator="{ props }">
              <v-btn
                v-bind="props"
                icon="mdi-download"
                :rounded="false"
                color="black"
                density="comfortable"
                variant="outlined"
                style="position: absolute; bottom: 10px; left: 55px; z-index: 5"
                @click="scenarioModelerStore.downloadDiagramAsXML"
              />
            </template>
          </v-tooltip>
          <v-tooltip text="BPMN Datei Herunterladen als SVG" location="right">
            <template v-slot:activator="{ props }">
              <v-btn
                v-bind="props"
                icon="mdi-printer"
                :rounded="false"
                color="black"
                density="comfortable"
                variant="outlined"
                style="position: absolute; bottom: 10px; left: 100px; z-index: 5"
                @click="scenarioModelerStore.downloadDiagramAsSVG"
              />
            </template>
          </v-tooltip>
          <input type="file" ref="fileInput" style="display: none" @change="handleFileUpload" />
        </div>
      </v-col>
      <v-col cols="3">
        <div id="properties-panel" ref="propertiesPanel" />
      </v-col>
    </v-row>
  </v-theme-provider>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from "vue";
import "bpmn-js-color-picker/colors/color-picker.css";
import "bpmn-js/dist/assets/bpmn-js.css";
import "bpmn-js/dist/assets/diagram-js.css";
import "bpmn-js/dist/assets/bpmn-font/css/bpmn.css";
import "bpmn-js/dist/assets/bpmn-font/css/bpmn-embedded.css";
import "bpmn-js-token-simulation/assets/css/bpmn-js-token-simulation.css";
import "@bpmn-io/properties-panel/assets/properties-panel.css";
import "bpmn-js-bpmnlint/dist/assets/css/bpmn-js-bpmnlint.css";
import BpmnModeler from "bpmn-js/lib/Modeler";
import LintModule from "bpmn-js-bpmnlint";
import BpmnColorPickerModule from "bpmn-js-color-picker";
import TokenSimulationModule from "bpmn-js-token-simulation";
import {
  BpmnPropertiesPanelModule,
  BpmnPropertiesProviderModule,
  CamundaPlatformPropertiesProviderModule
} from "bpmn-js-properties-panel";
import CustomProperties from "@/bpmn/properties/CustomProperties.js";
import CustomElements from "@/bpmn/modeler/customElements.ts";
import ReqPalModdle from "@/bpmn/properties/descriptors/ReqPal.json";
import CamundaBpmnModdle from "camunda-bpmn-moddle/resources/camunda.json";
import linterConfig from "@/bpmn/linter/packed-lint-config";
import { useScenarioModelerStore } from "@/stores/scenarioModeler.ts";

const scenarioModelerStore = useScenarioModelerStore();
const bpmnContainer = ref<HTMLElement | undefined>(undefined);
const propertiesPanel = ref<HTMLElement | null>(null);
const fileInput = ref<HTMLInputElement | null>(null);

onMounted(() => {
  scenarioModelerStore.bpmnModeler = new BpmnModeler({
    container: bpmnContainer.value,
    propertiesPanel: {
      parent: propertiesPanel.value
    },
    linting: {
      bpmnlint: linterConfig,
      active: true
    },
    additionalModules: [
      BpmnColorPickerModule,
      BpmnPropertiesPanelModule,
      BpmnPropertiesProviderModule,
      CamundaPlatformPropertiesProviderModule,
      TokenSimulationModule,
      CustomProperties,
      CustomElements,
      LintModule
    ],
    moddleExtensions: {
      camunda: CamundaBpmnModdle,
      reqPal: ReqPalModdle
    },
    keyboard: {
      bindTo: window
    }
  });
  scenarioModelerStore.loadInDiagram();
});

onBeforeUnmount(() => {
  scenarioModelerStore.bpmnModeler?.destroy();
});

const uploadDiagram = () => {
  fileInput.value?.click();
};

const handleFileUpload = async (event: Event) => {
  const input = event.target as HTMLInputElement;
  const file = input.files?.[0];
  if (file) {
   await scenarioModelerStore.loadInDiagramFromFile(file);
  }
};
</script>
<style>
.bts-set-animation-speed {
  margin-bottom: 40px;
}

.bts-notifications {
  margin-left: 150px;
}
</style>
