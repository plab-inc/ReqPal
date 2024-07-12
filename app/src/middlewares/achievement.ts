import {NavigationGuardNext, RouteLocationNormalized} from "vue-router";
import {useAchievementStore} from "@/stores/achievement.ts";

export async function fetchAchievementsByUser(to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) {
    try {
        const achievementStore = useAchievementStore();
        await achievementStore.fetchAchievementsByUser();
        return next();
    } catch (error) {
        return next({name: 'Error'});
    }
}

export async function fetchAchievementImages(to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) {
    try {
        const achievementStore = useAchievementStore();
        await achievementStore.fetchAchievementImages();
        return next();
    } catch (error) {
        return next({name: 'Error'});
    }
}