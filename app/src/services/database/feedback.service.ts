import {supabase} from "@/plugins/supabase";

class FeedbackServiceClass {

    public push = {
        postFeedback: this.postFeedback.bind(this)
    };

    public pull = {
    }

    private async postFeedback(feedback: string) {
        const {data, error} = await supabase
            .from('user_feedback')
            .insert([
                { feedback: feedback },
            ])

        if (error) throw error;

        return data;
    }
}

const FeedbackService = new FeedbackServiceClass();

export default FeedbackService;