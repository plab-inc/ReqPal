import {Database} from "@/types/supabase.types.ts";
import {Question} from "@/interfaces/Question.interfaces.ts";

export type LessonDTO = Database["public"]["Tables"]["lessons"]["Row"];
export type QuestionDTO = Database["public"]["Tables"]["questions"]["Row"];

export type Lesson = {
    id: number;
    title: string;
    description: string;
    points: number;
    questions: Question[];
}