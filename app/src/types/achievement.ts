import {Database} from "@/types/supabase.ts";

export type AchievementDTO = Database["public"]["Tables"]["achievements"]["Row"];

export type Achievement = {
    id: string;
    title: string;
    description: string;
    image: string;
}