import { Database } from "@/types/supabase.ts";

export type ScenarioDTO = Database["public"]["Tables"]["scenarios"]["Row"];
export type ScenarioProgressDTO = Database["public"]["Tables"]["scenario_user_progress"]["Row"];

export type Scenario = {
  id: string,
  user: string,
  title: string,
  description: string,
  deployed: boolean,
  locked: boolean,
  edited: boolean,
  lessonsCount: number,
  minLessons: number,
  achievements: string[];
  version?: number,
  createdAt?: string,
  bpmnXml?: string | Blob,
  svg?: string | Blob,
}

export type ScenarioProgress = {
  scenario: Scenario,
  user_id: String,
  currentStep: number,
  started: boolean,
  ended: boolean,
  currentLessonId?: string,
}