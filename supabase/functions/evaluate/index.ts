import {serve} from "https://deno.land/std@0.168.0/http/server.ts";
import {createClient} from 'npm:@supabase/supabase-js@2.43.3'
import {
    evaluateMultipleChoice,
    evaluateQualification,
    evaluateSlider,
    evaluateTrueOrFalse,
    evaluateLesson
} from "./evaluators/index.ts";


const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const evaluationRouter = {
    "/evaluate/trueorfalse": evaluateTrueOrFalse,
    "/evaluate/multiplechoice": evaluateMultipleChoice,
    "/evaluate/slider": evaluateSlider,
    "/evaluate/qualification": evaluateQualification,
    "/evaluate/lesson": evaluateLesson
}

interface RequestBodyQuestion {
    questionId: number;
    answer: string;
}
interface LessonAnswer {
    uuid: string,
    question: string,
    options: string,
    type: string
}
interface RequestBodyLesson {
    uuid: string,
    answers: LessonAnswer[],
    used_hints: number
}

function isRequestBodyQuestion(request: any): request is RequestBodyQuestion {
    return (request as RequestBodyQuestion).questionId !== undefined && (request as RequestBodyQuestion).answer !== undefined;
}

serve(async (req) => {
    const url = new URL(req.url);
    const path = url.pathname.toLowerCase();

    if (req.method === 'OPTIONS') {
        return new Response('ok', {headers: corsHeaders})
    }

    try {
        const supabaseClient = createClient(
            Deno.env.get('SUPABASE_URL') ?? '',
            Deno.env.get('SUPABASE_ANON_KEY') ?? '',
            {
                global: {
                    headers: {Authorization: req.headers.get('Authorization')!},
                },
            }
        )

        const request: RequestBodyQuestion | RequestBodyLesson = await req.json();

        if (isRequestBodyQuestion(request)) {
            //evaluate single answer for question type
            if (evaluationRouter[path]) {
                const result = await evaluationRouter[path](request.questionId, request.answer, supabaseClient);

                return new Response(JSON.stringify({request, result}), {
                    headers: {...corsHeaders, 'Content-Type': 'application/json'},
                    status: 200,
                });
            } else {
                throw new Error('Path not found: Path has to include the question type that shall be evaluated.');
            }
        } else {
            //evaluate whole lesson and persist data
            const authHeader = req.headers.get('Authorization')!
            const token = authHeader.replace('Bearer ', '')
            const { data } = await supabaseClient.auth.getUser(token)

            const result = await evaluateLesson(request.answers, request.uuid, data.user.id, supabaseClient);
            return new Response(JSON.stringify({request, result}), {
                headers: {...corsHeaders, 'Content-Type': 'application/json'},
                status: 200,
            });
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
