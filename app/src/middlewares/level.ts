import {NavigationGuardNext, RouteLocationNormalized} from "vue-router";
import {useLevelStore} from "@/stores/level.ts";

export async function fetchReqPalLevelByUser(to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) {
    try {
        const levelStore = useLevelStore();
        await levelStore.fetchReqPalLevelByUser();
        return next();
    } catch (error) {
        return next({name: 'Error'});
    }
}

export async function fetchObjectiveLevelsByUser(to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) {
    try {
        const levelStore = useLevelStore();
        await levelStore.fetchObjectiveLevelsByUser();
        return next();
    } catch (error) {
        return next({name: 'Error'});
    }
}
