import {supabase} from "@/plugins/supabase.ts";
import {ReqPalLevelDTO} from "@/types/level.ts";

class LevelServiceClass {

    public push = {

    };

    public pull = {
        fetchReqPalLevelByUser: this.fetchReqPalLevelByUser.bind(this)
    }

    private async fetchReqPalLevelByUser(userUUID: string): Promise<ReqPalLevelDTO | undefined> {
        const {data, error} = await supabase
            .from("user_reqpal_levels")
            .select("*")
            .eq("user_id", userUUID)

        if (error) throw error;

        if (data && data.length > 0) {
            console.log(data[0])
            return data[0] as ReqPalLevelDTO;
        }
    }
}

const LevelService = new LevelServiceClass();

export default LevelService;