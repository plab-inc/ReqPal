import {Database} from "@/types/supabase.ts";

export type ProfileDTO = Database["public"]["Tables"]["profiles"]["Row"];