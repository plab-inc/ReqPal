import {Database} from "@/types/supabase.types.ts";

export type Lesson = Database["public"]["Tables"]["lessons"]["Row"];

export enum questionTypes {
    MultipleChoice = "MultipleChoice",
    DragAndDrop = "DragAndDrop",
    TrueOrFalse = "TrueOrFalse",
    Sortable = "Sortable",
}

export type Question = {
    id: number;
    lessonId: number;
    description: string;
    questionType: questionTypes | null;
    userResults: Result | null;
}

export type Answer = {
    id: number,
    description: string;
}

export interface SortableAnswer {
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