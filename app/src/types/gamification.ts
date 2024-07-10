import {Database} from "@/types/supabase.ts";

export type XpActivityLogDTO = Database["public"]["Tables"]["xp_activity_logs"]["Row"];
