export interface Lesson {
    id: string;
    title: string;
    description: string;
}

export interface Question {
    id: string;
    lessonId: string;
    type: string;
    description: string;
    userResults: Result | null;
}

export interface Answer {
    id: string,
    description: string;
    solution: boolean;
}

export interface Result {
    wholeAnswerIsCorrect: boolean;
    results: answerResults[];
}

export interface answerResults {
    id: string,
    answerIsCorrect: boolean;
}