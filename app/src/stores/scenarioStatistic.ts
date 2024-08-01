import {defineStore} from "pinia";
import {Scenario} from "@/types/scenario.ts";
import ScenarioService from "@/services/database/scenario.ts";
import {useAuthStore} from "@/stores/auth.ts";
import {ScenarioUserStatistic} from "@/types/scenarioUserStatistic.ts";
import {mapToScenarioUserStatistic} from "@/mapper/scenarioUserStatistic.ts";
import {useAchievementStore} from "@/stores/achievement.ts";
import {useObjectiveStore} from "@/stores/objective.ts";
import {Achievement} from "@/types/achievement.ts";
import {Objective} from "@/types/objective.ts";

interface ThemeState {
    scenarioStatistics: ScenarioUserStatistic[];
}

export const useScenarioStatisticStore = defineStore("scenario_statistic", {
    state: (): ThemeState => ({
        scenarioStatistics: []
    }),
    getters: {
        getStatisticByScenario: (state) => (scenarioId: string) => {
            return state.scenarioStatistics.find((statistic: ScenarioUserStatistic) => statistic.scenarioId === scenarioId);
        }
    },
    actions: {
        async fetchScenarioStatistic(scenarios: Scenario[]) {
            this.scenarioStatistics = [];
            const authStore = useAuthStore();
            const achievementStore = useAchievementStore();
            const objectiveStore = useObjectiveStore();

            if (authStore.user) {
                const scenarioStatisticData = await ScenarioService.pull.fetchScenarioUserStatistics(scenarios, authStore.user.id);

                if (scenarioStatisticData) {
                    const achievementIds: Set<string> = new Set();
                    const objectiveIds: Set<string> = new Set();

                    scenarioStatisticData.forEach(d => {
                        d.achievements?.forEach(achievementId => achievementIds.add(achievementId));
                        d.objectives?.forEach(o => objectiveIds.add(o.objectiveId));
                    });

                    let achievements = await achievementStore.fetchAchievementsByIds(Array.from(achievementIds));
                    let objectives = await objectiveStore.fetchObjectivesByIds(Array.from(objectiveIds));

                    if (!achievements) achievements = [];
                    if (!objectives) objectives = [];

                    scenarioStatisticData.forEach(d => {

                        const userAchievements = d.achievements
                            ? d.achievements
                                .map(id => achievements.find(a => a.id === id))
                                .filter((a): a is Achievement => a !== undefined)
                            : [];

                        const userObjectives = d.objectives
                            ? d.objectives
                                .map(o => objectives.find(obj => obj.id === o.objectiveId))
                                .filter((o): o is Objective => o !== undefined)
                            : [];

                        const userStatistic = mapToScenarioUserStatistic(d, userAchievements, userObjectives);
                        this.scenarioStatistics.push(userStatistic);
                    });
                }
            }
        }
    }
});