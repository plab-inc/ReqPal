import {Database} from "@/types/supabase.ts";

export type AchievementDTO = Database["public"]["Tables"]["achievements"]["Row"];
export type ReqPalAchievementDTO = Database["public"]["Tables"]["reqpal_achievements"]["Row"]
export type ReqPalAchievementLevelDTO = Database["public"]["Tables"]["reqpal_achievement_levels"]["Row"]

export type Achievement = {
    id: string;
    title: string;
    description: string;
    image: string;
}

export type ReqPalAchievement = {
    id: string,
    description: string,
    created_at: string,
    target_field: string,
    firstLevelImage: string | null,
    example: boolean,
    levels: ReqPalAchievementLevelDTO[]
}