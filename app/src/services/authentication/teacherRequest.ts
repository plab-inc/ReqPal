import {supabase} from "@/plugins/supabase";
import {mapToTeacherRequest} from "@/mapper/teacherRequest.ts";
import {TeacherRequest, TeacherRequestDTO} from "@/types/teacherRequest.ts";

class TeacherRequestServiceClass {

    public push = {
        setApprovedStatusForRequest: this.setApprovedStatusForRequest.bind(this),
        deleteTeacherRequest: this.deleteTeacherRequest.bind(this),
        createNewTeacherRequest: this.createNewTeacherRequest.bind(this)
    };

    public pull = {
        fetchTeacherRequests: this.fetchTeacherRequests.bind(this),
        fetchLatestTeacherRequestByUser: this.fetchLatestTeacherRequestByUser.bind(this)
    }

    private async fetchTeacherRequests(): Promise<TeacherRequest[] | undefined> {
        const {data, error} = await supabase
            .from("teacher_requests")
            .select("*, profiles:profiles(username, role)")

        if (error) throw error;

        if (data && data.length > 0) {
            const mappedData: TeacherRequest[] = [];
            data.forEach(d => {
                mappedData.push(mapToTeacherRequest(d));
            })
            return mappedData;
        }
    }

    private async fetchLatestTeacherRequestByUser(userUUID: string): Promise<TeacherRequestDTO | undefined> {
        const {data, error} = await supabase
            .from("teacher_requests")
            .select("*")
            .eq('user_id', userUUID)
            .order('created_at', {ascending: false})
            .limit(1);

        if (error) throw error;

        if (data && data.length > 0) {
            return data[0];
        }
    }

    private async setApprovedStatusForRequest(id: string, approvedStatus: boolean): Promise<void> {
        const {error} = await supabase
            .from("teacher_requests")
            .update({
                approved: approvedStatus
            })
            .eq("id", id);

        if (error) throw error;
    }

    private async deleteTeacherRequest(id: string): Promise<void> {
        const {error} = await supabase
            .from("teacher_requests")
            .delete()
            .eq("id", id);

        if (error) throw error;
    }

    private async createNewTeacherRequest(userId: string): Promise<TeacherRequestDTO | undefined> {
        const {data, error} = await supabase
            .from("teacher_requests")
            .insert({
                user_id: userId,
            });

        if (error) throw error;

        if (data) return data;
    }
}

const TeacherRequestService = new TeacherRequestServiceClass();

export default TeacherRequestService;