<template>
  <v-container fluid>
    <v-row>
      <v-col cols="9">
        <div id="bpmn-container" ref="bpmnContainer" style="height: 85vh; position: relative;">
          <!-- Der Hauptinhalt geht hier hinein -->
          <v-btn
            icon="mdi-download"
            :rounded="false"
            color="black"
            density="comfortable"
            variant="outlined"
            style="position: absolute; bottom: 1px; left: 1px; z-index: 5"
            @click="downloadDiagram"
          />
          <v-btn
            icon="mdi-upload"
            :rounded="false"
            color="black"
            density="comfortable"
            variant="outlined"
            style="position: absolute; bottom: 1px; left: 50px; z-index: 5"
            @click="uploadDiagram"
          />
          <input type="file" ref="fileInput" style="display: none" @change="handleFileUpload" />
        </div>
      </v-col>
      <v-col cols="3">
        <div id="properties-panel" ref="propertiesPanel" style="height: 80vh; position: relative;"/>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import BpmnModeler from "bpmn-js/lib/Modeler";
import "bpmn-js/dist/assets/bpmn-js.css";
import "bpmn-js/dist/assets/diagram-js.css";
import "bpmn-js/dist/assets/bpmn-font/css/bpmn.css";
import "bpmn-js/dist/assets/bpmn-font/css/bpmn-embedded.css";
import "@bpmn-io/properties-panel/assets/properties-panel.css";
import {
  BpmnPropertiesPanelModule,
  BpmnPropertiesProviderModule,
  CamundaPlatformPropertiesProviderModule
} from "bpmn-js-properties-panel";
import CamundaBpmnModdle from "camunda-bpmn-moddle/resources/camunda.json";
import CustomProperties from "./properties/CustomProperties.js";
import UserTaskLesson from "./properties/descriptors/UserTaskLesson.json";
import { onBeforeUnmount, onMounted, ref } from "vue";
import CustomElements from "./custom/customElements.ts";

const bpmnContainer = ref(null);
const bpmnModeler = ref(null);
const propertiesPanel = ref(null);
const fileInput = ref(null);

onMounted(() => {
  bpmnModeler.value = new BpmnModeler({
    container: bpmnContainer.value,
    propertiesPanel: {
      parent: propertiesPanel.value
    },
    additionalModules: [
      BpmnPropertiesPanelModule,
      BpmnPropertiesProviderModule,
      CamundaPlatformPropertiesProviderModule,
      CustomProperties,
      CustomElements,
    ],
    moddleExtensions: {
      camunda: CamundaBpmnModdle,
      lesson: UserTaskLesson
    },
    keyboard: {
      bindTo: window
    }
  });

  bpmnModeler.value.createDiagram();
})

onBeforeUnmount(() => {
  bpmnModeler.value?.destroy();
});


const downloadDiagram = async () => {
  try {
    const { xml } = await bpmnModeler.value.saveXML({ format: true });
    const blob = new Blob([xml], { type: 'text/xml' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'diagram.bpmn';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (err) {
    console.error('Error saving BPMN diagram:', err);
  }
};

const uploadDiagram = () => {
  fileInput.value.click();
};

const handleFileUpload = async (event) => {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = async (e) => {
      const xml = e.target.result;
      try {
        await bpmnModeler.value.importXML(xml);
      } catch (err) {
        console.error('Error importing BPMN diagram:', err);
      }
    };
    reader.readAsText(file);
  }
};


</script>