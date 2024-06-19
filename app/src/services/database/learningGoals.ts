import {supabase} from "@/plugins/supabase";
import {LearningGoal, LearningGoalDTO} from "@/types/learningGoals.ts";

class LearningGoalsServiceClass {

    public push = {
        uploadLearningGoal: this.uploadLearningGoal.bind(this),
        updateLearningGoal: this.updateLearningGoal.bind(this),
        deleteLearningGoal: this.deleteLearningGoal.bind(this)
    };

    public pull = {
        fetchLearningGoalsByUser: this.fetchLearningGoalsByUser.bind(this),
        fetchLearningGoalsByIds: this.fetchLearningGoalsByIds.bind(this),
        fetchLearningGoals: this.fetchLearningGoals.bind(this)
    };

    private async fetchLearningGoalsByUser(userUUID: string): Promise<LearningGoal[] | undefined> {
        const {data, error} = await supabase
            .from("learning_goals")
            .select("*")
            .eq("user_id", userUUID)

        if (error) throw error;

        if (data) {
            return data as LearningGoal[];
        }
    }

    private async fetchLearningGoals(): Promise<LearningGoal[] | undefined> {
        const {data, error} = await supabase
            .from("learning_goals")
            .select("*")

        if (error) throw error;

        if (data) {
            return data as LearningGoal[];
        }
    }

    private async fetchLearningGoalsByIds(goalIds: string[]): Promise<LearningGoal[]> {
        const {data, error} = await supabase
            .from("learning_goals")
            .select("*")
            .in("id", goalIds);

        if (error) throw error;

        return data as LearningGoal[];
    }


    private async uploadLearningGoal(learningGoal: LearningGoal, userUUID: string): Promise<LearningGoal | undefined> {
        const {data, error} = await supabase
            .from('learning_goals')
            .insert(
                {
                    user_id: userUUID,
                    name: learningGoal.name,
                    description: learningGoal.description,
                    max_level: learningGoal.max_level
                }
            )
            .select()

        if (error) throw error;

        return data[0] as LearningGoal;
    }

    private async updateLearningGoal(learningGoal: LearningGoal) {
        if (!learningGoal.id) {
            throw new Error("Learning goal Id not found.")
        }
        const {error} = await supabase
            .from("learning_goals")
            .update({
                name: learningGoal.name,
                description: learningGoal.description,
                max_level: learningGoal.max_level
            })
            .eq("id", learningGoal.id);

        if (error) {
            throw error;
        }
    }

    async deleteLearningGoal(learningGoalId: string): Promise<LearningGoalDTO[]> {
        const {data, error} = await supabase
            .from("learning_goals")
            .delete()
            .eq("id", learningGoalId)
            .select();

        if (error) throw error;

        return data;
    }
}

const LearningGoalsService = new LearningGoalsServiceClass();

export default LearningGoalsService;