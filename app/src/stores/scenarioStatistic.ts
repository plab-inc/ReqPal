import {defineStore} from "pinia";
import {Scenario} from "@/types/scenario.ts";
import ScenarioService from "@/services/database/scenario.ts";
import {useAuthStore} from "@/stores/auth.ts";
import {LessonQuestionResult, ScenarioUserStatistic} from "@/types/scenarioUserStatistic.ts";
import {mapStatisticToQuestionWithResult, mapToScenarioUserStatistic} from "@/mapper/scenarioUserStatistic.ts";
import {useAchievementStore} from "@/stores/achievement.ts";
import {useObjectiveStore} from "@/stores/objective.ts";
import {Achievement} from "@/types/achievement.ts";
import {Objective} from "@/types/objective.ts";
import {useLessonStore} from "@/stores/lesson.ts";
import {LessonQuestions} from "@/types/lesson.ts";

interface ThemeState {
    scenarioStatistics: ScenarioUserStatistic[];
    currentScenarioStatistic: ScenarioUserStatistic | null;
    currentScenarioResults: LessonQuestionResult[];
}

export const useScenarioStatisticStore = defineStore("scenario_statistic", {
    state: (): ThemeState => ({
        scenarioStatistics: [],
        currentScenarioStatistic: null,
        currentScenarioResults: []
    }),
    getters: {
        getStatisticByScenario: (state) => (scenarioId: string) => {
            return state.scenarioStatistics.find((statistic: ScenarioUserStatistic) => statistic.scenarioId === scenarioId);
        }
    },
    actions: {
        async fetchScenarioStatistics(scenarios: Scenario[]) {
            this.scenarioStatistics = [];
            const authStore = useAuthStore();
            const achievementStore = useAchievementStore();
            const objectiveStore = useObjectiveStore();

            if (authStore.user) {
                const scenarioStatisticData = await ScenarioService.pull.fetchScenarioUserStatistics(scenarios, authStore.user.id);

                if (scenarioStatisticData) {
                    const achievementIds: string[] = [];
                    const objectiveIds: string[] = [];

                    scenarioStatisticData.forEach(d => {
                        d.achievements?.forEach(achievementId => achievementIds.push(achievementId));
                        d.objectives?.forEach(o => objectiveIds.push(o.objectiveId));
                    });

                    let achievements = await achievementStore.fetchAchievementsByIds(achievementIds);
                    let objectives = await objectiveStore.fetchObjectivesByIds(objectiveIds);

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
        },

        async fetchCurrentScenarioStatistic(scenario: Scenario) {
            this.currentScenarioStatistic = null;

            const authStore = useAuthStore();
            const achievementStore = useAchievementStore();
            const objectiveStore = useObjectiveStore();

            if (authStore.user) {
                const scenarioStatisticData = await ScenarioService.pull.fetchScenarioUserStatistic(scenario, authStore.user.id);

                if (scenarioStatisticData) {
                    const achievementIds: string[] = [];
                    const objectiveIds: string[] = [];

                    scenarioStatisticData.achievements?.forEach(achievementId => achievementIds.push(achievementId));
                    scenarioStatisticData.objectives?.forEach(o => objectiveIds.push(o.objectiveId));

                    let achievements = await achievementStore.fetchAchievementsByIds(achievementIds);
                    let objectives = await objectiveStore.fetchObjectivesByIds(objectiveIds);

                    if (!achievements) achievements = [];
                    if (!objectives) objectives = [];

                    const userAchievements = scenarioStatisticData.achievements
                        ? scenarioStatisticData.achievements
                            .map(id => achievements.find(a => a.id === id))
                            .filter((a): a is Achievement => a !== undefined)
                        : [];

                    const userObjectives = scenarioStatisticData.objectives
                        ? scenarioStatisticData.objectives
                            .map(o => objectives.find(obj => obj.id === o.objectiveId))
                            .filter((o): o is Objective => o !== undefined)
                        : [];

                    this.currentScenarioStatistic = mapToScenarioUserStatistic(scenarioStatisticData, userAchievements, userObjectives);
                    console.log("fetched stats")
                    console.log(this.currentScenarioStatistic)
                }
            }
        },

        async fetchCurrentLessonResultsForCurrentScenario() {
            if (!this.currentScenarioStatistic) {
                return;
            }

            const lessonStore = useLessonStore();
            const lessonIds: string[] = [];

            this.currentScenarioStatistic.lessonResults?.forEach(res => lessonIds.push(res.lessonId));

            const lessons: LessonQuestions[] | undefined = await lessonStore.fetchQuestionsWithLessons(lessonIds);
            this.currentScenarioResults = [];

            if (lessons) {
                this.currentScenarioResults = mapStatisticToQuestionWithResult(this.currentScenarioStatistic, lessons);
            }
            console.log("fetched lesres")
            console.log(this.currentScenarioResults)
        }
    }
});