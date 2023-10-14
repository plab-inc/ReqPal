export interface QuestionModel {
    [key: string]: string | boolean | number | null | JSON | undefined;
    question: string | null;
    solution: JSON | null;
    hint: string | null;
    requirement?: string | null;
}