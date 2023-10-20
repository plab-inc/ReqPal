import {inherits} from "@babel/types";

export interface Question {
    [key: string]: any;
    question: string | null;
    options: string[] | null;
    hint: string | null;

    solution?: any | null;
    position?: number | null;
    type?: string | null;
}

export interface solution {
    [key: string]: any;
}

export interface multipleChoiceAnswer extends solution{
    id: number,
    description: string,
    solution: boolean
}
export interface trueOrFalseAnswer extends solution{
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
