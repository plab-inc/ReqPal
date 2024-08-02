import {Achievement} from "@/types/achievement.ts";
import {Objective} from "@/types/objective.ts";
import {Database, Json} from "@/types/supabase.ts";

export type ScenarioUserStatisticDTO = Database["public"]["Tables"]["scenario_user_statistics"]["Row"];

export type ObjectiveStatisticData = {
    objectiveId: string,
    xp: number
}

export type ScenarioUserStatisticData = {
    achievements: string[] | null;
    created_at: string;
    id: string;
    lesson_results: Json | null;
    objectives: ObjectiveStatisticData[] | null;
    scenario_user_progress_id: string;
    score: number | null;
    scenario_user_progress: {scenario_id: string, user_id: string};
}

export type ScenarioUserStatistic = {
    id: string,
    user_id: string,
    scenarioId: string,
    scenarioProgressId: string,
    achievements: Achievement[],
    objectiveStatistics: ObjectiveStatistic[],
    lessonResults: LessonResult[],
    score: number
}

export type ObjectiveStatistic = {
    objective: Objective,
    xp: number
}

export type LessonResult = {
    results: (TrueOrFalseResult | SliderResult | MultipleChoiceResult | RequirementResult)[],
    lessonId: string,
    totalScore: number
}

export type TrueOrFalseResult = {
    type: 'TrueOrFalse',
    input: boolean,
    score: number,
    correct: boolean,
    questionId: string
}

export type SliderResult = {
    type: 'Slider',
    input: number,
    score: number,
    correct: boolean,
    questionId: string
}

export type MultipleChoiceResult = {
    type: 'MultipleChoice',
    score: number,
    results: {
        id: number,
        input: boolean,
        correct: boolean
    }[],
    questionId: string
}

export type RequirementResult = {
    type: 'Requirement',
    score: number,
    questionId: string,
    requirementId: string,
    productResults: {
        id: string,
        input: number,
        correct: boolean
    }[]
}