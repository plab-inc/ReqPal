import { Database } from "@/types/supabase.ts";

export type TeacherRequestDTO = Database["public"]["Tables"]["teacher_requests"]["Row"];

export type TeacherRequest = {
    id: string,
    user_id: string,
    approved: boolean,
    username: string,
    role: string
}