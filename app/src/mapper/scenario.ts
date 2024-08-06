import { Scenario, ScenarioDTO, ScenarioProgress, ScenarioProgressDTO } from "@/types/scenario.ts";
import { QuestionAnswer } from "@/types/lesson.ts";

export const mapToScenario = (input: ScenarioDTO): Scenario => {
  return {
    lessonsCount: input.lessons,
    minLessons: input.minLessons,
    id: input.id,
    user: input.user_id,
    title: input.title,
    description: input.description ?? '',
    achievements: input.achievements,
    deployed: input.deployed,
    locked: input.locked,
    edited: input.edited,
    version: input.version,
    createdAt: input.created_at
  };
};

export const mapToScenarioProgress = (inputScenarioProgress: ScenarioProgressDTO, inputScenario: Scenario): ScenarioProgress => {
  return {
    scenario: inputScenario,
    userId: inputScenarioProgress.user_id,
    currentStep: inputScenarioProgress.step,
    started: inputScenarioProgress.started,
    ended: inputScenarioProgress.ended,
    currentLessonId: inputScenarioProgress.lesson_id || undefined,
    currentLessonAnswers: inputScenarioProgress.lesson_answers as QuestionAnswer[] || undefined
  };
};