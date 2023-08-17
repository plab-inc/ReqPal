import {NavigationGuardNext, RouteLocationNormalized} from "vue-router";
import { supabase } from '@/plugins/supabase';

async function isAuthenticated() {
    const { data, error } = await supabase.auth.getSession();
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