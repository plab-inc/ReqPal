import {defineStore} from 'pinia';
import { Scenario, ScenarioForm } from "@/types/scenario.ts";
import {v4 as uuidv4} from 'uuid';
import diagramXML from '@/assets/bpmn/diagram.bpmn?raw';

interface ScenarioFormState {
  uuid: string;
  title: string,
  description: string,
  diagram: string
}

export const useScenarioFormStore = defineStore('scenarioForm', {
  state: (): ScenarioFormState => ({
    uuid: uuidv4(),
    title: '',
    description: '',
    diagram: diagramXML

  }),
  getters: {
    isDirty: (state) => {
      return state.title.length > 0 && state.title.length > 0;
    }
  },
  actions: {
    flushStore() {
      this.uuid = uuidv4();
      this.title = '';
      this.description = '';
      this.diagram = diagramXML
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
        processDefinitionKey: processDefinitionKey,
      }
    },
    hydrate(scenario: ScenarioForm) {

    }
  }
});
