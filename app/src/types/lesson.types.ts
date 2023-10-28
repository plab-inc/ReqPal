import {Database} from "@/types/supabase.types.ts";
import {Question} from "@/interfaces/Question.interfaces.ts";

export type LessonDTO = Database["public"]["Tables"]["lessons"]["Row"];
export type QuestionDTO = Database["public"]["Tables"]["questions"]["Row"];

export type Lesson = {
    lessonDTO: LessonDTO,
    isFinished: boolean,
    isStarted: boolean,
    userScore: number
}

export type LessonForm = {
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

export type LessonStatistic = {
    finished: boolean,
    user_points: number
}