export interface QuestionModel {
    [key: string]: undefined | null | string | boolean | number |  trueOrFalseAnswer | multipleChoiceAnswer | multipleChoiceAnswer[] | sliderAnswer;
    question: string | null;
    solution: trueOrFalseAnswer | null;
    hint: string | null;
    requirement?: string | null;
}
export interface trueOrFalseAnswer {
    id: number;
    true: boolean;
}

export interface multipleChoiceAnswer {
    id: number,
    description: string,
    solution: boolean
}

export interface sliderAnswer {
    id: number,
    minValue: number,
    maxValue: number,
    correctValue: number,
    tolerance: number,
    steps: number
}