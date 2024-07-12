<template>
  <v-theme-provider theme="light" with-background>
    <v-row no-gutters>
      <v-col cols="9">
        <div id="bpmn-container" ref="bpmnContainer" style="height: 72vh;">
          <v-tooltip text="BPMN Datei Hochladen" location="top left">
            <template v-slot:activator="{ props }">
              <v-btn
                v-bind="props"
                icon="mdi-upload"
                :rounded="false"
                color="black"
                density="comfortable"
                variant="outlined"
                style="position: absolute; bottom: 5px; left: 10px; z-index: 5"
                @click="saveScenario"
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
                style="position: absolute; bottom: 5px; left: 55px; z-index: 5"
                @click="downloadDiagramAsXML"
              />
            </template>
          </v-tooltip>
          <v-tooltip text="BPMN Datei Herunterladen als SVG" location="top left">
            <template v-slot:activator="{ props }">
              <v-btn
                v-bind="props"
                icon="mdi-printer"
                :rounded="false"
                color="black"
                density="comfortable"
                variant="outlined"
                style="position: absolute; bottom: 5px; left: 100px; z-index: 5"
                @click="downloadDiagramAsSVG"
              />
            </template>
          </v-tooltip>
          <input type="file" ref="fileInput" style="display: none" @change="handleFileUpload" />
        </div>
      </v-col>
      <v-col cols="3">
        <div id="properties-panel" ref="propertiesPanel" style="position: relative;" />
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
import BpmnModeler from "bpmn-js/lib/Modeler";
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

import { useAuthStore } from "@/stores/auth.ts";
import { BpmnStorageService } from "@/services/storage/bpmn.ts";
import { useScenarioFormStore } from "@/stores/scenarioForm.ts";
import { Scenario } from "@/types/scenario.ts";
import ScenarioService from "@/services/database/scenario.ts";

const bpmnContainer = ref<HTMLElement | undefined>(undefined);
const bpmnModeler = ref<BpmnModeler | null>(null);
const propertiesPanel = ref<HTMLElement | null>(null);
const fileInput = ref<HTMLInputElement | null>(null);

const authStore = useAuthStore();
const scenarioFromStore = useScenarioFormStore();

onMounted(() => {
  bpmnModeler.value = new BpmnModeler({
    container: bpmnContainer.value,
    propertiesPanel: {
      parent: propertiesPanel.value
    },
    additionalModules: [
      BpmnColorPickerModule,
      BpmnPropertiesPanelModule,
      BpmnPropertiesProviderModule,
      CamundaPlatformPropertiesProviderModule,
      TokenSimulationModule,
      CustomProperties,
      CustomElements
    ],
    moddleExtensions: {
      camunda: CamundaBpmnModdle,
      reqPal: ReqPalModdle
    },
    keyboard: {
      bindTo: window
    }
  });

  bpmnModeler.value.importXML(scenarioFromStore.diagram);
});

onBeforeUnmount(() => {
  bpmnModeler.value?.destroy();
});

const getDiagramXML = async (): Promise<string | undefined> => {
  try {
    const result = await bpmnModeler.value?.saveXML({ format: true });
    return result?.xml;
  } catch (err) {
    console.error("Error saving BPMN diagram as XML:", err);
  }
};

const getDiagramSvg = async (): Promise<string | undefined> => {
  try {
    const result = await bpmnModeler.value?.saveSVG();
    return result?.svg;
  } catch (err) {
    console.error("Error saving BPMN diagram as SVG:", err);
  }
};

const downloadDiagramAsXML = async () => {
  const xml = await getDiagramXML();
  if (xml) {
    const blob = new Blob([xml], { type: "text/xml" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "diagram.bpmn";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};

const downloadDiagramAsSVG = async () => {
  const svg = await getDiagramSvg();
  if (svg) {
    const blob = new Blob([svg], { type: "image/svg+xml" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "diagram.svg";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};

const uploadDiagram = () => {
  fileInput.value?.click();
};

const handleFileUpload = async (event: Event) => {
  const input = event.target as HTMLInputElement;
  const file = input.files?.[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = async (e) => {
      const xml = e.target?.result as string;
      try {
        await bpmnModeler.value?.open(xml);
      } catch (err) {
        console.error("Error importing BPMN diagram:", err);
      }
    };
    reader.readAsText(file);
  }
};

const saveScenario = async () => {

  const xml = await getDiagramXML();
  const svg = await getDiagramSvg();

  if(xml && svg && authStore.user) {

    const processId = (bpmnModeler.value as any).get('canvas').getRootElement().id

    const scenario: Scenario = scenarioFromStore.generateScenario(authStore.user.id, xml, svg, processId)

    await BpmnStorageService.push.uploadScenarioAssets(scenario).then((paths) => {
        if(paths){
          scenario.bpmnPath = paths.bpmnPath;
          scenario.svgPath = paths.svgPath;
          ScenarioService.push.uploadScenario(scenario);
        }
      }
    );
  }

}

</script>