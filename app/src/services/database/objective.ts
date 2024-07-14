import {supabase} from "@/plugins/supabase";
import {Objective} from "@/types/objective.ts";

class ObjectiveServiceClass {

    public push = {
        uploadObjective: this.uploadObjective.bind(this),
        updateObjective: this.updateObjective.bind(this),
        deleteObjective: this.deleteObjective.bind(this)
    };

    public pull = {
        fetchObjectivesByUser: this.fetchObjectivesByUser.bind(this),
        fetchObjectivesByIds: this.fetchObjectivesByIds.bind(this),
        fetchObjectives: this.fetchObjectives.bind(this)
    };

    private async fetchObjectivesByUser(userUUID: string): Promise<Objective[] | undefined> {
        const {data, error} = await supabase
            .from("objectives")
            .select("*")
            .eq("user_id", userUUID)

        if (error) throw error;

        if (data) {
            return data as Objective[];
        }
    }

    private async fetchObjectives(): Promise<Objective[] | undefined> {
        const {data, error} = await supabase
            .from("objectives")
            .select("*")

        if (error) throw error;

        if (data) {
            return data as Objective[];
        }
    }

    private async fetchObjectivesByIds(objectiveIds: string[]): Promise<Objective[]> {
        const {data, error} = await supabase
            .from("objectives")
            .select("*")
            .in("id", objectiveIds);

        if (error) throw error;

        return data as Objective[];
    }


    private async uploadObjective(objective: Objective, userUUID: string): Promise<Objective | undefined> {
        const {data, error} = await supabase
            .from('objectives')
            .insert(
                {
                    user_id: userUUID,
                    name: objective.name,
                    description: objective.description,
                    max_level: objective.max_level
                }
            )
            .select()

        if (error) throw error;

        return data[0] as Objective;
    }

    private async updateObjective(objective: Objective) {
        if (!objective.id) {
            throw new Error("Objective Id not found.")
        }
        const {error} = await supabase
            .from("objectives")
            .update({
                name: objective.name,
                description: objective.description,
                max_level: objective.max_level
            })
            .eq("id", objective.id);

        if (error) {
            throw error;
        }
    }

    async deleteObjective(objectiveId: string): Promise<void> {
        const {data, error} = await supabase
            .from("objectives")
            .delete()
            .eq("id", objectiveId)

        if (error) throw error;
    }
}

const objectiveService = new ObjectiveServiceClass();

export default objectiveService;