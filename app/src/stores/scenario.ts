import { defineStore } from "pinia";
import { Scenario } from "@/types/scenario.ts";
import ScenarioService from "@/services/database/scenario.ts";
import { mapToScenario } from "@/mapper/scenario.ts";
import { BpmnStorageService } from "@/services/storage/bpmn.ts";
import { deleteScenario, deployScenario } from "@/services/api/scenario.ts";
import { useAuthStore } from "@/stores/auth.ts";

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
            const authStore = useAuthStore();

            let scenarioStatistics = undefined;

            if(fetchedScenarios){

                const scenarioIds = fetchedScenarios.map(scenarioDTO => scenarioDTO.id);

                if (authStore.isTeacher) scenarioStatistics = await ScenarioService.pull.getScenarioStatistics(scenarioIds);

                for(const scenarioDTO of fetchedScenarios){
                    const scenario = mapToScenario(scenarioDTO);
                    if (authStore.isTeacher) {
                        scenario.svg = await BpmnStorageService.pull.getDiagramSvg(scenario);
                        scenario.studentProgressStatistics = scenarioStatistics?.find(stat => stat.scenarioId === scenario.id);

                        console.log(scenarioStatistics);
                    }
                    this.scenarios.push(scenario);
                }
            }
        },
        async checkIfScenarioTitleExists(scenarioTitle: string, scenarioId: string): Promise<boolean> {
            if (this.scenarios.length === 0) {
                await this.fetchScenarios();
            }

            return this.scenarios.some(scenario => scenario.title === scenarioTitle && scenario.id !== scenarioId);
        },
        async deployScenario(scenario: Scenario) {
            await deployScenario(scenario.id).then(() => {
                scenario.deployed = true;
                scenario.edited = false;
            });
        },
        async deleteScenario(scenario: Scenario) {
            await deleteScenario(scenario.id).then(() => {
                this.scenarios.splice(this.scenarios.findIndex(s => s.id === scenario.id), 1);
            });
        }
    }
});
