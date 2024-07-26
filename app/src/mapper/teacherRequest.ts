import {TeacherRequest} from "@/types/teacherRequest.ts";

export const mapToTeacherRequest = (input: any): TeacherRequest => {
    let profile = {
        role: "", username: ""
    }

    if (input.profiles) {
        profile.username = input.profiles.username;
        profile.role = input.profiles.role;
    }

    return {
        approved: input.approved,
        role: profile.role,
        id: input.id,
        user_id: input.user_id,
        username: profile.username
    };
};