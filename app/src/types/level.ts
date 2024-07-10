import {Database} from "@/types/supabase.ts";
import {Objective} from "@/types/objective.ts";

export type LevelDTO = Database["public"]["Tables"]["user_levels"]["Row"];
export type ReqPalLevelDTO = Database["public"]["Tables"]["user_reqpal_levels"]["Row"];

export type ObjectiveLevel = {
    created_at: string | null;
    id: string;
    level: number | null;
    max: boolean | null;
    objective_id: string | null;
    user_id: string | null;
    xp: number | null;
    xp_threshold: number | null;
    objective: Objective;
};