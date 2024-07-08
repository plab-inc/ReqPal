import {Database} from "@/types/supabase.ts";

export type ObjectiveDTO = Database["public"]["Tables"]["objectives"]["Row"];

export type Objective = {
    id: string;
    name: string;
    description: string;
    max_level: number;
}
