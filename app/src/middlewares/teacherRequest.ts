import {useTeacherRequestStore} from "@/stores/teacherRequest.ts";
import {NavigationGuardNext, RouteLocationNormalized} from "vue-router";

export async function fetchTeacherRequests(to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) {
    try {
        const teacherRequestStore = useTeacherRequestStore();
        await teacherRequestStore.fetchTeacherRequests();
        return next();
    } catch (error) {
        return next({name: 'Error'});
    }
}
