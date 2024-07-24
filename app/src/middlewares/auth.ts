import {NavigationGuardNext, RouteLocationNormalized} from "vue-router";
import {supabase} from '@/plugins/supabase';
import {useAuthStore} from "@/stores/auth.ts";
import alertService from "@/services/util/alert.ts";

async function isAuthenticated() {
    const {data, error} = await supabase.auth.getSession();
    if (error) throw error;
    return data.session !== null;
}


export async function requiresAuth(to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) {

    if (!await isAuthenticated()) {
        return next({
            name: 'LogIn'
        });
    }

    return next();
}


export async function requiresTeacher(to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) {

    const authStore = useAuthStore();

    if (await isAuthenticated() && authStore.isTeacher) {
        return next();
    }

    alertService.addErrorAlert("Sie haben keine Zugriffsberechtigung.")
    return next({name: 'Home'});
}

export async function requiresModerator(to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) {

    const authStore = useAuthStore();

    if (await isAuthenticated() && authStore.isModerator) {
        return next();
    }

    alertService.addErrorAlert("Sie haben keine Zugriffsberechtigung.")
    return next({name: 'Home'});
}

export async function requiresStudent(to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) {

    const authStore = useAuthStore();

    if (await isAuthenticated() && !authStore.isTeacher) {
        return next();
    }

    alertService.addErrorAlert("Sie haben keine Zugriffsberechtigung.")
    return next({name: 'Home'});
}