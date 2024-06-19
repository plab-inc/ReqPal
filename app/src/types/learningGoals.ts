import {Database} from "@/types/supabase.ts";

export type LearningGoalDTO = Database["public"]["Tables"]["learning_goals"]["Row"];

export type LearningGoal = {
    id: string;
    name: string;
    description: string;
    max_level: number;
}
