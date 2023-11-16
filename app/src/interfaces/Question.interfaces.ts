export interface Question {
    [key: string]: any;
    uuid: string;
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