import { defineStore } from 'pinia';
import { Scenario } from "@/types/scenario.ts";
import { v4 as uuidv4 } from 'uuid';
import diagramXML from '@/assets/bpmn/diagram.bpmn?raw';
import { BpmnStorageService } from "@/services/storage/bpmn.ts";
import ScenarioService from "@/services/database/scenario.ts";
import { useAuthStore } from "@/stores/auth.ts";
import BpmnModeler from "bpmn-js/lib/Modeler";

interface ModelerState {
  uuid: string;
  title: string;
  description: string;
  diagram: string;
  bpmnModeler: BpmnModeler | null;
}

export const scenarioModelerStore = defineStore('scenarioModeler', {
  state: (): ModelerState => ({
    uuid: uuidv4(),
    title: '',
    description: '',
    diagram: diagramXML,
    bpmnModeler: null
  }),
  getters: {
    isDirty: (state) => {
      return state.title.length > 0 && state.description.length > 0;
    }
  },
  actions: {
    setModeler(modeler: BpmnModeler) {
      this.bpmnModeler = modeler;
    },
    flushScenario() {
      this.uuid = uuidv4();
      this.title = '';
      this.description = '';
      this.bpmnModeler?.importXML(diagramXML)
    },
    generateScenario(userId: string, xml: string, svg: string, processDefinitionKey: string): Scenario {
      return {
        id: this.uuid,
        title: this.title,
        description: this.description,
        user: userId,
        locked: true,
        deployed: false,
        svg: svg,
        bpmnXml: xml,
        processDefinitionKey: processDefinitionKey
      };
    },
    async saveScenario() {
      const authStore = useAuthStore();
      if (authStore.user && this.bpmnModeler) {
        const xml = await this.getDiagramXML();
        const svg = await this.getDiagramSvg();
        const processDefinitionKey = await this.getDiagramProcessId();

        if (xml && svg && processDefinitionKey) {
          const scenario: Scenario = this.generateScenario(authStore.user.id, xml, svg, processDefinitionKey);

          const paths = await BpmnStorageService.push.uploadScenarioAssets(scenario);

          if (paths) {
            scenario.bpmnPath = paths.bpmnPath;
            scenario.svgPath = paths.svgPath;
            await ScenarioService.push.uploadScenario(scenario);
          }
        }
      }
    },
    async loadInBaseDiagram(){
      this.bpmnModeler?.importXML(diagramXML);
    },
    async getDiagramXML(): Promise<string | undefined> {
      try {
        if (this.bpmnModeler) {
          const result = await this.bpmnModeler.saveXML({ format: true });
          return result?.xml;
        }
      } catch (err) {
        console.error("Error saving BPMN diagram as XML:", err);
      }
    },
    async getDiagramSvg(): Promise<string | undefined> {
      try {
        if (this.bpmnModeler) {
          const result = await this.bpmnModeler.saveSVG();
          return result?.svg;
        }
      } catch (err) {
        console.error("Error saving BPMN diagram as SVG:", err);
      }
    },
    async getDiagramProcessId(): Promise<string | undefined> {
      if (this.bpmnModeler) {
        return (this.bpmnModeler as any).get('canvas').getRootElement().id;
      }
    },
    async downloadDiagramAsXML() {
      this.getDiagramXML().then((xml) => {
        if (xml) {
          const blob = new Blob([xml], { type: "text/xml" });
          const link = document.createElement("a");
          link.href = URL.createObjectURL(blob);
          link.download = "diagram.bpmn";
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }
      });
    },
    async downloadDiagramAsSVG() {
      this.getDiagramSvg().then((svg) => {
        if (svg) {
          const blob = new Blob([svg], { type: "image/svg+xml" });
          const link = document.createElement("a");
          link.href = URL.createObjectURL(blob);
          link.download = "diagram.svg";
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }
      });
    },
    async loadInDiagram(file: File) {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const xml = e.target?.result as string;
        try {
          if (this.bpmnModeler) {
            await this.bpmnModeler.importXML(xml);
          }
        } catch (err) {
          console.error("Error importing BPMN diagram:", err);
        }
      };
      reader.readAsText(file);
    }
  }
});
