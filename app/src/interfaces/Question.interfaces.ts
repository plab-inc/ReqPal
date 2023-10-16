export interface Question {
    [key: string]: any;
    question: string | null;
    options: string[] | null;
    solution: trueOrFalseAnswer | multipleChoiceAnswer | null;
    hint: string | null;
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