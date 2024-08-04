import {Database} from "@/types/supabase.ts";

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
    levels: ReqPalAchievementLevelDTO[]
}

export type StudentAchievement = {
    title: string;
    description: string;
    image: string;
    amount: number;
    created_at: string;
}

export type StudentReqPalAchievementLevel = {
    level: number;
    threshold: number;
    title: string;
    description: string;
    image: string;
    xp: number;
}

export type StudentReqPalAchievement = {
    description: string;
    created_at: string;
    example: boolean;
    currentLevel: StudentReqPalAchievementLevel;
    previousLevels: StudentReqPalAchievementLevel[];
    max: boolean;
    reqPalAchievementId: string;
}