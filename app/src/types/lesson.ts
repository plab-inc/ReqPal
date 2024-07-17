import {Database} from "@/types/supabase.ts";
import {Objective} from "@/types/objective.ts";

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
    objective: Objective | null

    creatorAvatar?: string,
    creatorUsername?: string,
}

export type LessonForm = {
    uuid: string;
    title: string;
    description: string;
    questions: Question[];
    objectiveId: string | null;
}

export type UserAnswer = {
    question_id: string,
    answer: string[]
}

export type LessonStatistic = {
    finished: boolean,
    user_points: number
}