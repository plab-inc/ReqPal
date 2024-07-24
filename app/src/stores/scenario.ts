import { defineStore } from "pinia";
import { Scenario } from "@/types/scenario.ts";
import ScenarioService from "@/services/database/scenario.ts";
import { BpmnStorageService } from "@/services/storage/bpmn.ts";
import { mapToScenario } from "@/mapper/scenario.ts";

interface ScenarioState {
    scenarios: Scenario[];
}

export const useScenarioStore = defineStore('scenario', {
    state: (): ScenarioState => ({
        scenarios: []
    }),

    getters: {
        getScenarios: state => {
            return state.scenarios
        },
    },

    actions: {
        async fetchScenarios() {
            this.scenarios = []
            const fetchedScenarios = await ScenarioService.pull.fetchScenarios();

            if(fetchedScenarios){
                for(const scenarioDTO of fetchedScenarios){
                    const scenario = mapToScenario(scenarioDTO);
                    scenario.svg = await BpmnStorageService.pull.getDiagramSvg(scenario);
                    this.scenarios.push(scenario);
                }
            }
        },
        async checkIfScenarioTitleExists(scenarioTitle: string, scenarioId: string): Promise<boolean> {
            if (this.scenarios.length === 0) {
                await this.fetchScenarios();
            }

            return this.scenarios.some(scenario => scenario.title === scenarioTitle && scenario.id !== scenarioId);
        }
    }
});
