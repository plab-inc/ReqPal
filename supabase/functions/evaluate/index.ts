import {serve} from "https://deno.land/std@0.168.0/http/server.ts";
import {createClient} from 'npm:@supabase/supabase-js@2.43.3'

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

    if (req.method === 'OPTIONS') {
        return new Response('ok', {headers: corsHeaders})
    }

    try {
        const supabaseClient = createClient(
            Deno.env.get('SUPABASE_URL') ?? '',
            Deno.env.get('SUPABASE_ANON_KEY') ?? '',
            {
                global: {
                    headers: { Authorization: req.headers.get('Authorization')! },
                },
            }
        )

        const request: RequestBody = await req.json();

        if (evaluationRouter[path]) {
            const result = await evaluationRouter[path](request.questionId, request.answer, supabaseClient);

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
