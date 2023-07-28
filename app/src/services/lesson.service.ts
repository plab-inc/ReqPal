import {supabase} from "@/plugins/supabase";
import {Answer, Result} from "@/stores/lesson.store";

export async function compareUserAnswers(userAnswerJson: Answer[], questionId: number) {

    let userResult: Result | undefined;

    const {data, error} = await supabase.rpc('mc_compare_solution', {
        answer_json: userAnswerJson,
        question_id: questionId,
    })

    if (error) {
        console.error(error)
    }

    userResult = data;
    /*
    if (userResult) {
        console.log(userResult)
        const results = userResult.results;

        results.forEach((answerResult: { id: string, answerIsCorrect: boolean }) => {
            const {id, answerIsCorrect} = answerResult;
            console.log(answerResult);
        });
    }*/
    return userResult;
}