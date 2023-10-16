import {NavigationGuardNext, RouteLocationNormalized} from "vue-router";
import {useCatalogStore} from "@/stores/catalog.store.ts";

export async function fetchCatalogs(to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) {
    try {
        const catalogStore = useCatalogStore();
        await catalogStore.getAllCatalogs();
        return next();
    } catch (error) {
        return next({name: 'Error'});
    }
}