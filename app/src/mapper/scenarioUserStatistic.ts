import {
    LessonQuestionResult,
    LessonResult,
    ObjectiveStatistic,
    ObjectiveStatisticData, QuestionResult,
    ScenarioUserStatistic,
    ScenarioUserStatisticData,
} from "@/types/scenarioUserStatistic.ts";
import {Achievement} from "@/types/achievement.ts";
import {Objective} from "@/types/objective.ts";
import {LessonQuestions, Question} from "@/types/lesson.ts";

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

const allowedQuestionTypes = ['TrueOrFalse', 'Requirement', 'MultipleChoice', 'Slider'];

const filterQuestionsByType = (questions: Question[]): Question[] => {
    return questions.filter(question => allowedQuestionTypes.includes(question.question_type));
}

export const mapStatisticToQuestionWithResult = (inputStatistic: ScenarioUserStatistic, inputLessons: LessonQuestions[]): LessonQuestionResult[] => {
    let result: LessonQuestionResult[] = [];

    inputStatistic.lessonResults?.forEach(lessonResult => {
        const lessonQuestion = inputLessons.find(lesson => lesson.lesson.lessonDTO.uuid === lessonResult.lessonId);
        if (lessonQuestion) {
            let mappedQuestionsAndResults: QuestionResult[] = [];

            const filteredQuestions = filterQuestionsByType(lessonQuestion.questions);

            filteredQuestions.forEach(question => {
                const resultForQuestion = lessonResult.results.find(result => question.uuid === result.questionId);
                if (resultForQuestion) {
                    mappedQuestionsAndResults.push(<QuestionResult>{
                        questionData: question,
                        resultData: resultForQuestion,
                        type: resultForQuestion.type ? resultForQuestion.type : ""
                    });
                }
            });

            result.push({
                lessonQuestion: lessonQuestion,
                questionResults: mappedQuestionsAndResults,
                totalLessonScore: lessonResult.totalScore
            });
        }
    });

    return result;
}