import { Database } from "@/types/supabase.ts";
import { ObjectiveDTO } from "@/types/objective.ts";

export type LessonDTO = Database["public"]["Tables"]["lessons"]["Row"];
export type QuestionDTO = Database["public"]["Tables"]["questions"]["Row"];

export type Question = {
  [key: string]: any;
  uuid: string;
  question: string | null;
  options: string[] | null;
  hint: string | null;
  points?: number | null;

  solution?: any | null;
  position?: number | null;
  type?: string | null;
}

export type Lesson = {
  lessonDTO: LessonDTO,
  objectives: ObjectiveDTO[],

  creatorAvatar?: string,
  creatorUsername?: string,
}

export type QuestionAnswer = {
  questionId: string,
  type: string
  options: any,
}

export type LessonQuestions = {
  lesson: Lesson,
  questions: Question[]
}

export type LessonForm = {
  uuid: string;
  title: string;
  description: string;
  questions: Question[];
  objectiveIds: string[];
}