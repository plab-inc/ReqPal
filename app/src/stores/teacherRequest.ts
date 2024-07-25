import {defineStore} from "pinia";
import {useAuthStore} from "@/stores/auth.ts";
import {AuthenticationError} from "@/errors/custom.ts";
import TeacherRequestService from "@/services/authentication/teacherRequest.ts";
import {TeacherRequest, TeacherRequestDTO} from "@/types/teacherRequest.ts";

interface TeacherRequestState {
    requests: TeacherRequest[],
    latestRequest: TeacherRequestDTO | null
}

export const useTeacherRequestStore = defineStore('teacherRequests', {
    state: (): TeacherRequestState => ({
        requests: [],
        latestRequest: null
    }),

    getters: {
        getRequests: (state) => {
            return state.requests;
        },
    },

    actions: {
        async fetchTeacherRequests(): Promise<TeacherRequest[] | undefined> {
            this.requests = [];
            const authStore = useAuthStore();
            if (authStore.user && authStore.isModerator) {
                const data = await TeacherRequestService.pull.fetchTeacherRequests();
                if (data) {
                    this.requests = data;
                    return data;
                }
            } else {
                throw new AuthenticationError("No authorized user found.", 401)
            }
        },

        async fetchLatestTeacherRequestByUser(): Promise<TeacherRequestDTO | undefined> {
            this.requests = [];
            this.latestRequest = null;
            const authStore = useAuthStore();
            if (authStore.user && authStore.isPending) {
                const data = await TeacherRequestService.pull.fetchLatestTeacherRequestByUser(authStore.user.id);
                if (data) {
                    this.latestRequest = data;
                    return data;
                }
            } else {
                throw new AuthenticationError("No authorized user found.", 401)
            }
        },

        async setApprovedStatusForRequest(requestId: string, approved: boolean) {
            const authStore = useAuthStore();
            const isAdmin = await authStore.isClaimsAdmin();
            if (authStore.user && authStore.isModerator && isAdmin) {
                await TeacherRequestService.push.setApprovedStatusForRequest(requestId, approved);
                const found: number = this.requests.findIndex(r => r.id === requestId);
                if (found > 0) this.requests[found].approved = true;
            } else {
                throw new AuthenticationError("No authorized user found.", 401)
            }
        },

        async deleteTeacherRequest(requestId: string) {
            const authStore = useAuthStore();
            const isAdmin = await authStore.isClaimsAdmin();
            if (authStore.user && authStore.isModerator && isAdmin) {
                await TeacherRequestService.push.deleteTeacherRequest(requestId);
                const found: number = this.requests.findIndex(r => r.id === requestId);
                if (found > 0) this.requests.splice(found, 1);
            } else {
                throw new AuthenticationError("No authorized user found.", 401)
            }
        },

        async sendNewRequest() {
            const authStore = useAuthStore();
            if (authStore.user && authStore.isPending && !this.latestRequest) {
                const data = await TeacherRequestService.push.createNewTeacherRequest(authStore.user.id);
                if (data) this.latestRequest = data;
            } else {
                throw new AuthenticationError("No authorized user found.", 401)
            }
        },
    }
});