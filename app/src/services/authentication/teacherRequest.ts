import {supabase} from "@/plugins/supabase";
import {mapToTeacherRequest} from "@/mapper/teacherRequest.ts";
import {TeacherRequest} from "@/types/teacherRequest.ts";

class TeacherRequestServiceClass {

    public push = {
        setApprovedStatusForRequest: this.setApprovedStatusForRequest.bind(this),
        deleteTeacherRequest: this.deleteTeacherRequest.bind(this),
    };

    public pull = {
        fetchTeacherRequests: this.fetchTeacherRequests.bind(this),
    }

    private async fetchTeacherRequests(): Promise<TeacherRequest[] | undefined> {
        const {data, error} = await supabase
            .from("teacher_requests")
            .select("*, profiles:profiles(username, role)")

        if (error) throw error;

        if (data && data.length > 0) {
            const mappedData: TeacherRequest[] = [];
            data.forEach(d => {
                console.log(d);
                mappedData.push(mapToTeacherRequest(d));
            })
            console.log(mappedData)
            return mappedData;
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

}

const TeacherRequestService = new TeacherRequestServiceClass();

export default TeacherRequestService;