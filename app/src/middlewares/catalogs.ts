import {NavigationGuardNext, RouteLocationNormalized} from "vue-router";
import {useCatalogStore} from "@/stores/catalog.ts";

export async function fetchCatalogs(to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) {
    try {
        const catalogStore = useCatalogStore();
        await catalogStore.fetchCatalogs();
        return next();
    } catch (error) {
        return next({name: 'Error'});
    }
}