import {Database} from "@/types/supabase.types.ts";

export type Lesson = Database["public"]["Tables"]["lessons"]["Row"];
export type Question = Database["public"]["Tables"]["questions"]["Row"];

export type Answer = {
    id: number,
    description: string;
}

export type SortableAnswer = {
    id: string,
    description: string;
    order: number
}

export type Result = {
    wholeAnswerIsCorrect: boolean;
    results: answerResults[];
}

export type answerResults = {
    id: number,
    answerIsCorrect: boolean;
}

export type mcAnswer = {
    id: number,
    description: string,
    solution: boolean
}