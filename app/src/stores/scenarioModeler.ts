import { defineStore } from "pinia";
import { Scenario } from "@/types/scenario.ts";
import { v4 as uuidv4 } from "uuid";
import baseDiagramXml from "@/assets/bpmn/diagram.bpmn?raw";
import baseDiagramSvg from "@/assets/bpmn/diagram.svg?raw";
import { BpmnStorageService } from "@/services/storage/bpmn.ts";
import ScenarioService from "@/services/database/scenario.ts";
import { useAuthStore } from "@/stores/auth.ts";
import BpmnModeler from "bpmn-js/lib/Modeler";
import {
  findShortestPath,
  getAllAchievementIds,
  getAllUserTaskIds,
  validateProcessDefinition
} from "@/bpmn/modeler/helpers.ts";
import { BpmnImportError, BpmnPersistError } from "@/errors/custom.ts";

interface ModelerState {
  uuid: string;
  title: string;
  description: string;
  diagram: string;
  baseDiagramSvg: string;
  modelerWarning: boolean;
  bpmnModeler: BpmnModeler | null;
}

export const useScenarioModelerStore = defineStore('scenarioModeler', {
  state: (): ModelerState => ({
    uuid: uuidv4(),
    title: '',
    description: '',
    diagram: baseDiagramXml,
    baseDiagramSvg: baseDiagramSvg,
    bpmnModeler: null,
    modelerWarning: false
  }),
  getters: {
    isDirty: (state) => {
      return state.title.length > 0 && state.description.length > 0 && state.diagram !== baseDiagramXml;
    },
    getProcessId: (state) => {
      return 'Process_' + state.uuid;
    }
  },
  actions: {
    async flushScenarioData() {
      this.title = '';
      this.description = '';
      this.diagram = baseDiagramXml;
    },
    async generateNewUUID(){
      this.uuid = uuidv4();
    },
    async saveScenario() {
      const authStore = useAuthStore();
      if (authStore.user && this.bpmnModeler) {
        const xml = await this.getDiagramXML();
        const svg = await this.getDiagramSvg();

        if (xml && svg) {
          const scenario: Scenario = await this.generateScenario(authStore.user.id, xml, svg);
          const paths = await BpmnStorageService.push.manageScenarioAssets(scenario, "upload");

          if (paths) {
            await ScenarioService.push.uploadScenario(scenario);
          }
        }
      }
    },
    async generateScenario(userId: string, xml: string, svg: string): Promise<Scenario> {
      const processDefinition = ((this.bpmnModeler?.getDefinitions() as unknown) as {
        rootElements: any[]
      }).rootElements[0];
      if (!processDefinition) throw new Error("Es gibt ein Problem mit dem Modeller.");

      await validateProcessDefinition(processDefinition).catch((error) => {
        this.modelerWarning = true;

        setTimeout(() => {
          this.modelerWarning = false;
        }, 10000);

        throw error;
      });

      const shortestPath = await findShortestPath(processDefinition);
      const lessonsInDiagram = await getAllUserTaskIds(processDefinition);
      const achievementsInDiagram = await getAllAchievementIds(processDefinition);

      return {
        id: this.uuid,
        title: this.title,
        description: this.description,
        user: userId,
        locked: true,
        edited: true,
        deployed: false,
        svg: svg,
        bpmnXml: xml,
        lessonsCount: lessonsInDiagram.length,
        minLessons: shortestPath.length,
        achievements: achievementsInDiagram
      };
    },
    async hydrate(scenario: Scenario){
      this.uuid = scenario.id;
      this.title = scenario.title;
      this.description = scenario.description;
      this.diagram = await BpmnStorageService.pull.getDiagramXml(scenario) || baseDiagramXml;
    },
    async loadInDiagram(){
      this.bpmnModeler?.importXML(this.diagram);
    },
    async getDiagramXML(): Promise<string | undefined> {
      try {
        if (this.bpmnModeler) {
          const result = await this.bpmnModeler.saveXML({ format: true });
          return result?.xml;
        }
      } catch (err: any) {
        throw new BpmnPersistError("Error saving BPMN diagram as XML: " + err.toString());
      }
    },
    async getDiagramSvg(): Promise<string | undefined> {
      try {
        if (this.bpmnModeler) {
          const result = await this.bpmnModeler.saveSVG();
          return result?.svg;
        }
      } catch (err: any) {
        throw new BpmnPersistError("Error saving BPMN diagram as SVG: " + err.toString());
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
    async loadInDiagramFromFile(file: File) {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const xml = e.target?.result as string;
        try {
          if (this.bpmnModeler) {
            await this.bpmnModeler.importXML(xml);
          }
        } catch (err: any) {
          throw new BpmnImportError(err.toString());
        }
      };
      reader.readAsText(file);
    }
  }
});
