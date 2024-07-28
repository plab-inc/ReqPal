import { Scenario, ScenarioDTO, ScenarioProgress, ScenarioUserDTO } from "@/types/scenario.ts";

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
    version: input.version,
    createdAt: input.created_at
  };
};

export const mapToScenarioProgress = (inputScenarioUser: ScenarioUserDTO, inputScenario: Scenario): ScenarioProgress => {
  return {
    scenario: inputScenario,
    user_id: inputScenarioUser.user_id,
    currentStep: inputScenarioUser.step,
    started: inputScenarioUser.started,
    ended: inputScenarioUser.ended,
    currentLessonId: inputScenarioUser.lesson_id || undefined
  };
};