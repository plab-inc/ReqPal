import {Database} from "@/types/supabase.ts";
import {Objective} from "@/types/objective.ts";

export type LevelDTO = Database["public"]["Tables"]["user_levels"]["Row"];
export type ReqPalLevelDTO = Database["public"]["Tables"]["user_reqpal_levels"]["Row"];

export type ObjectiveLevel = {
    levelDto: LevelDTO,
    objective: Objective
}
