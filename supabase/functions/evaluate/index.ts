import {serve} from "https://deno.land/std@0.168.0/http/server.ts";
import {createClient} from 'npm:@supabase/supabase-js@2.43.3'
import { evaluateTrueOrFalse } from './evaulators/trueOrFalse.ts';

//Author: Laura
interface CommonResult {
    score: number;
    isCorrect: boolean;
}

interface MultipleChoiceAnswer {
    id: number;
    input: boolean;
    description: string;
}

const evaluateMultipleChoice = async (supabase: any, questionId: number, answers: MultipleChoiceAnswer[]) => {
    interface MultipleChoiceResult {
        score: number;
        results: SingleMultipleChoiceResult[];
    }

    interface SingleMultipleChoiceResult {
        id: number;
        isCorrect: boolean;
    }

    const {data, error} = await supabase
        .from('questions')
        .select('*')
        .eq("uuid", questionId)

    if (error) throw error;

    if (data.length <= 0) {
        throw new Error('Question not found.');
    }

    if (answers.length <= 0) {
        throw new Error('No answers were provided.');
    }

    try {
        const question = data[0];
        const result: MultipleChoiceResult = {score: 0, results: []};
        const pointsPerRightAnswer = question.points / question.solution.length;

        question.solution.forEach(s => {
            const toCompare: MultipleChoiceAnswer = answers.find(answer => answer.id === s.id);
            if (toCompare) {
                const comparedResult: boolean = toCompare.input === s.solution;
                result.results.push({id: s.id, isCorrect: comparedResult})
                if (comparedResult) {
                    result.score += pointsPerRightAnswer;
                }
            }
        })

        if (result.score > 0) {
            result.score = Number(result.score.toFixed(2));
        }

        return result;
    } catch (error) {
        throw error;
    }
}

interface SliderAnswer {
    input: number,
    steps: number,
    maxValue: number,
    minValue: number
}

const evaluateSlider = async (supabase: any, questionId: number, answer: SliderAnswer) => {

    const {data, error} = await supabase
        .from('questions')
        .select('solution, points')
        .eq("uuid", questionId)

    if (error) throw error;

    if (data.length <= 0) {
        throw new Error('Question not found.');
    }

    try {
        const question = data[0];

        const minValue = (+question.solution.correctValue - +question.solution.toleranceValue);
        const maxValue = (+question.solution.correctValue + +question.solution.toleranceValue);
        const correctValue = (+question.solution.correctValue);
        const result: CommonResult = {score: 0, isCorrect: false};

        if (answer.input === correctValue || answer.input >= minValue && answer.input <= maxValue) {
            result.isCorrect = true;
            result.score = question.points;
        }

        return result;
    } catch (error) {
        throw error;
    }
}

interface QualificationAnswer {
    products: { id: number, input: number }[]
    catalogId: number,
    productIds: number[],
    requirementId: number,
    askForQualification: boolean
}

const evaluateQualification = async (supabase: any, questionId: number, answer: QualificationAnswer) => {

    interface QualificationResult {
        score: number,
        results: {id: number, isCorrect: boolean}[]
    }

    if(!answer.askForQualification) {
        throw new Error("Error: Answer does not ask for a qualification check.")
    }

    if(answer.products.length <= 0) {
        throw new Error("Answers are missing product values.")
    }

    const {data, error} = await supabase
        .from('questions')
        .select('solution, options, points')
        .eq("uuid", questionId)

    if (error) throw error;

    if (data.length <= 0) {
        throw new Error('Question not found.');
    }

    try {
        const question = data[0];
        const toleranceValue : number = question.solution.toleranceValue;
        const result: QualificationResult = {score: 0, results: []};
        const pointsPerRightAnswer : number = question.points / answer.products.length;

        for (const productAnswer of answer.products) {
            const {data, error} = await supabase
                .from('product_requirements')
                .select('qualification')
                .eq("product_id", productAnswer.id)
                .eq("requirement_id", answer.requirementId)

            if(error) throw error;

            if(data.length <= 0) {
                throw new Error("No solution found for product and requirement.")
            }

            const qualification : number = data[0].qualification;
            const minValue : number = (+qualification - +toleranceValue);
            const maxValue : number = (+qualification + +toleranceValue);
            const comparedResult = productAnswer.input === qualification || (productAnswer.input >= minValue && productAnswer.input <= maxValue);

            if(comparedResult) {
                result.score += pointsPerRightAnswer;
            }
            result.results.push({id: productAnswer.id, isCorrect: comparedResult});
        }
        return result;
    } catch (error) {
        throw error;
    }
}

interface RequestBody {
    questionId: number;
    answer: string;
}

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const evaluationRouter = {
    "/evaluate/trueorfalse": evaluateTrueOrFalse,
    "/evaluate/multiplechoice": evaluateMultipleChoice,
    "/evaluate/slider": evaluateSlider,
    "/evaluate/qualification": evaluateQualification
}

serve(async (req) => {
    const url = new URL(req.url);
    const path = url.pathname.toLowerCase();

    // This is needed if you're planning to invoke your function from a browser.
    if (req.method === 'OPTIONS') {
        return new Response('ok', {headers: corsHeaders})
    }

    try {
        // Create a Supabase client with the Auth context of the logged in user.
        const supabaseClient = createClient(
            // Supabase API URL - env var exported by default.
            Deno.env.get('SUPABASE_URL') ?? '',
            // Supabase API ANON KEY - env var exported by default.
            Deno.env.get('SUPABASE_ANON_KEY') ?? '',
            // Create client with Auth context of the user that called the function.
            // This way your row-level-security (RLS) policies are applied.
            {
                global: {
                    headers: { Authorization: req.headers.get('Authorization')! },
                },
            }
        )

        const request: RequestBody = await req.json();

        if (evaluationRouter[path]) {
            const result = await evaluationRouter[path](request.questionId, request.answer);

            return new Response(JSON.stringify({request, result}), {
                headers: {...corsHeaders, 'Content-Type': 'application/json'},
                status: 200,
            });
        } else {
            throw new Error('Path not found: Path has to include the question type that shall be evaluated.');
        }
    } catch (error) {
        return new Response(JSON.stringify({error: error.message}), {
            headers: {...corsHeaders, 'Content-Type': 'application/json'},
            status: 400,
        })
    }
})

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/evaluate/trueorfalse' \
    --header 'Authorization: Bearer <Anon Key oder Service Role Key' \
    --header 'Content-Type: application/json' \
    --data '{"questionId":"uuid", "answer": true'

*/
