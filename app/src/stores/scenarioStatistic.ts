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
    currentScenarioResults: LessonQuestionResult[];
}

export const useScenarioStatisticStore = defineStore("scenario_statistic", {
    state: (): ThemeState => ({
        scenarioStatistics: [],
        currentScenarioResults: []
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

        async fetchQuestionsForCurrentLessonResultsForScenario(scenarioId: string) {
            if (this.scenarioStatistics.length < 0) {
                return;
            }

            const statisticByScenario = this.getStatisticByScenario(scenarioId);

            if (statisticByScenario) {
                const lessonStore = useLessonStore();
                const lessonIds: string[] = [];

                statisticByScenario.lessonResults?.forEach(res => lessonIds.push(res.lessonId));

                const lessons: LessonQuestions[] | undefined = await lessonStore.fetchQuestionsWithLessons(lessonIds);
                this.currentScenarioResults = [];

                if (lessons) {
                    this.currentScenarioResults = mapStatisticToQuestionWithResult(statisticByScenario, lessons);
                }
            }
        },
    }
});