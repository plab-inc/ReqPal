import {supabase} from "@/plugins/supabase.ts";
import {ObjectiveLevel, ReqPalLevelDTO} from "@/types/level.ts";
import {mapToObjectiveLevel} from "@/mapper/level.ts";

class LevelServiceClass {

    public push = {};

    public pull = {
        fetchReqPalLevelByUser: this.fetchReqPalLevelByUser.bind(this),
        fetchObjectiveLevelsByUser: this.fetchObjectiveLevelsByUser.bind(this)
    }

    private async fetchReqPalLevelByUser(userUUID: string): Promise<ReqPalLevelDTO | undefined> {
        const {data, error} = await supabase
            .from("user_reqpal_levels")
            .select("*")
            .eq("user_id", userUUID)

        if (error) throw error;

        if (data && data.length > 0) {
            return data[0] as ReqPalLevelDTO;
        }
    }

    private async fetchObjectiveLevelsByUser(userUUID: string): Promise<ObjectiveLevel[] | undefined> {

        const {data, error} = await supabase
            .from('user_levels')
            .select(`
            *, 
            objectives ( name, description, max_level )`)

        if (error) throw error;

        if (data) {
            const result: ObjectiveLevel[] = [];
            data.forEach(d => {
                result.push(mapToObjectiveLevel(d));
            })
            return result;
        }
    }
}

const LevelService = new LevelServiceClass();

export default LevelService;