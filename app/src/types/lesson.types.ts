import {Database} from "@/types/supabase.types.ts";
import {Question} from "@/interfaces/Question.interfaces.ts";

export type LessonDTO = Database["public"]["Tables"]["lessons"]["Row"];
export type QuestionDTO = Database["public"]["Tables"]["questions"]["Row"];

export type Lesson = {
    uuid: string;
    title: string;
    description: string;
    points: number;
    questions: Question[];
}

export type LessonAnswer = {
    uuid: string,
    usedHints: number,
    answers: any[]
}

export type UserAnswer = {
    question_id: string,
    answer: string[]
}

export type UserResult = {
    result: {score: number, results: any, isCorrect: boolean}
}