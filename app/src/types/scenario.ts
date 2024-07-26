import { Database } from "@/types/supabase.ts";

export type ScenarioDTO = Database["public"]["Tables"]["scenarios"]["Row"];

export type Scenario = {
  id: string,
  user: string,
  title: string,
  description: string,
  deployed: boolean,
  locked: boolean,
  lessonsCount: number,
  minLessons: number,
  achievements: string[];
  version?: number,
  createdAt?: string,
  bpmnXml?: string | Blob,
  svg?: string | Blob,
}

export type ScenarioForm = {
  scenarioName: string,
  scenarioDescription: string,
  processId: string
}