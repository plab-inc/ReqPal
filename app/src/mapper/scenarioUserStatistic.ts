import {
    LessonResult,
    MultipleChoiceResult,
    ObjectiveStatistic,
    ObjectiveStatisticData,
    RequirementResult,
    ScenarioUserStatistic,
    ScenarioUserStatisticData,
    SliderResult,
    TrueOrFalseResult
} from "@/types/scenarioUserStatistic.ts";
import {Achievement} from "@/types/achievement.ts";
import {Objective} from "@/types/objective.ts";
import {Json} from "@/types/supabase.ts";
import lesson from "@/services/database/lesson.ts";


export const mapToScenarioUserStatisticData = (inputScenarioStatistic: any): ScenarioUserStatisticData => {

    let achievementsData: string[] = [];
    let objectivesData: ObjectiveStatisticData[] = []
    
    if (inputScenarioStatistic.achievements && inputScenarioStatistic.achievements.gainedAchievements) {
        inputScenarioStatistic.achievements.gainedAchievements.forEach((a: string) => {
            achievementsData.push(a);
        });
    }

    if (inputScenarioStatistic.objectives && inputScenarioStatistic.objectives.gainedObjectives) {
        inputScenarioStatistic.objectives.gainedObjectives.forEach((obj: any) => {
            objectivesData.push({objectiveId: obj.id, xp: obj.xp});
        });
    }

    return {
        achievements: achievementsData,
        created_at: inputScenarioStatistic.created_at,
        id: inputScenarioStatistic.id,
        lesson_results: inputScenarioStatistic.lesson_results ? inputScenarioStatistic.lesson_results : {},
        objectives: objectivesData,
        scenario_user_progress: inputScenarioStatistic.scenario_user_progress,
        scenario_user_progress_id: inputScenarioStatistic.scenario_user_progress_id,
        score: inputScenarioStatistic.score
    };
};

export const mapToScenarioUserStatistic = (inputScenarioStatistic: ScenarioUserStatisticData, achievements: Achievement[], objectives: Objective[]): ScenarioUserStatistic => {
    const objectiveXpMap = new Map<string, number>();
    if (inputScenarioStatistic.objectives) {
        inputScenarioStatistic.objectives.forEach(o => {
            objectiveXpMap.set(o.objectiveId, o.xp);
        });
    }

    const objectiveStatistics: ObjectiveStatistic[] = objectives.map(o => ({
        objective: o,
        xp: objectiveXpMap.get(o.id) ?? 0
    }));

    return {
        achievements: achievements,
        id: inputScenarioStatistic.id,
        lessonResults: inputScenarioStatistic.lesson_results as LessonResult[],
        objectiveStatistics: objectiveStatistics,
        scenarioId: inputScenarioStatistic.scenario_user_progress.scenario_id,
        scenarioProgressId: inputScenarioStatistic.scenario_user_progress_id,
        score: inputScenarioStatistic.score ? inputScenarioStatistic.score : 0,
        user_id: inputScenarioStatistic.scenario_user_progress.user_id
    };
};

// TODO maybe not needed
const mapLessonResultsToQuestionResults = (inputLessonResult: Json): LessonResult[] => {
    if (!inputLessonResult) return [];

    return (inputLessonResult as any[]).map((resultGroup: any) => {
        const results: (TrueOrFalseResult | SliderResult | MultipleChoiceResult | RequirementResult)[] = resultGroup.results.map((result: any) => {
            switch (result.type) {
                case 'TrueOrFalse':
                    return {
                        type: 'TrueOrFalse',
                        input: result.input,
                        score: result.score,
                        correct: result.correct,
                        questionId: result.questionId
                    } as TrueOrFalseResult;
                case 'Slider':
                    return {
                        type: 'Slider',
                        input: result.input,
                        score: result.score,
                        correct: result.correct,
                        questionId: result.questionId
                    } as SliderResult;
                case 'MultipleChoice':
                    return {
                        type: 'MultipleChoice',
                        score: result.score,
                        results: result.results.map((choice: any) => ({
                            id: choice.id,
                            input: choice.input,
                            correct: choice.correct
                        })),
                        questionId: result.questionId
                    } as MultipleChoiceResult;
                case 'Requirement':
                    return {
                        type: 'Requirement',
                        score: result.score,
                        questionId: result.questionId,
                        requirementId: result.requirementId,
                        productResults: result.productResults.map((product: any) => ({
                            id: product.id,
                            input: product.input,
                            correct: product.correct
                        }))
                    } as RequirementResult;
                default:
                    return null;
            }
        }).filter((r: any): r is TrueOrFalseResult | SliderResult | MultipleChoiceResult | RequirementResult => r !== null);

        return {
            results,
            lessonId: resultGroup.lessonId,
            totalScore: resultGroup.totalScore
        } as LessonResult;
    });
};
