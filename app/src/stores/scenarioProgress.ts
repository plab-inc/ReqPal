import { defineStore } from "pinia";
import { Scenario, ScenarioProgress } from "@/types/scenario.ts";
import ScenarioService from "@/services/database/scenario.ts";

interface ThemeState {
  progresses: ScenarioProgress[];
}

export const useScenarioProgressStore = defineStore("progress", {
  state: (): ThemeState => ({
    progresses: []
  }),
  getters: {
    getProgressByScenario: (state) => (scenario: Scenario) => {
      return state.progresses.find(progress => progress.scenario === scenario);
    }
  },
  actions: {
    async fetchScenarioProgresses(scenarios: Scenario[]) {
      this.progresses = [];
      await ScenarioService.pull.fetchScenarioProgresses(scenarios).then((progresses) => {
        if (progresses) {
          this.progresses = progresses;
          return;
        }
      });
    }
  }
});