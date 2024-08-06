import {Database} from "@/types/supabase.ts";

export type UserStatisticDTO = Database["public"]["Tables"]["user_statistics"]["Row"]
