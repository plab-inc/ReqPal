export interface Question {
    [key: string]: any;
    question: string | null;
    options: string[] | null;
    solution: any | null;
    hint: string | null;

    position?: number | null;
    type?: string | null;
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