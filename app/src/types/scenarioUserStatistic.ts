import {Achievement} from "@/types/achievement.ts";
import {Objective} from "@/types/objective.ts";
import {Scenario} from "@/types/scenario.ts";
import {Database} from "@/types/supabase.ts";

export type ScenarioUserStatisticDTO = Database["public"]["Tables"]["scenario_user_statistics"]["Row"];

export type ScenarioUserStatistic = {
    id: string,
    user_id: string,
    scenario: Scenario,
    scenarioProgressId: string,
    achievements: Achievement[],
    objectives: ObjectiveStatistic[],
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