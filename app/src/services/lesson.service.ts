import {supabase} from "@/plugins/supabase";
import {Answer} from "@/stores/lesson.store";

export async function compareUserAnswers(userAnswerJson: Answer[], questionAnswerJson: Answer[]) {

    const userResults: Answer[] = [];

    const {data, error} = await supabase.rpc('check_user_answers', {
        user_answers_json: userAnswerJson,
        correct_answers_json: questionAnswerJson,
    })

    if (error) {
        console.error(error)
    }

    if (data) {
        data.forEach((resultData: string) => {
            const parsed = JSON.parse(resultData);
            userResults.push(parsed);
        })
        return userResults;
    }
}
