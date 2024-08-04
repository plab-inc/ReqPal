import {NavigationGuardNext, RouteLocationNormalized} from "vue-router";
import {useProfileStore} from "@/stores/profile.ts";

export async function fetchStatisticsByStudent(to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) {
    try {
        const profileStore = useProfileStore();
        await profileStore.fetchStatisticsByStudent();
        return next();
    } catch (error) {
        return next({name: 'Error'});
    }
}

