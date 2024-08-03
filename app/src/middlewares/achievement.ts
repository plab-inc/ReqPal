import {NavigationGuardNext, RouteLocationNormalized} from "vue-router";
import {useAchievementStore} from "@/stores/achievement.ts";
import {useStudentAchievementStore} from "@/stores/studentAchievement.ts";

export async function fetchAchievementsByUser(to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) {
    try {
        const achievementStore = useAchievementStore();
        await achievementStore.fetchAchievementsByUser();
        return next();
    } catch (error) {
        return next({name: 'Error'});
    }
}

export async function fetchAchievementsByStudent(to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) {
    try {
        const studentAchievementStore = useStudentAchievementStore();
        await studentAchievementStore.fetchAchievementsByStudent();
        await studentAchievementStore.fetchReqPalAchievementsByStudent();
        return next();
    } catch (error) {
        return next({name: 'Error'});
    }
}

export async function fetchReqPalAchievementsByModerator(to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) {
    try {
        const achievementStore = useAchievementStore();
        await achievementStore.fetchReqPalAchievementsByModerator();
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

export async function fetchReqPalAchievementImages(to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) {
    try {
        const achievementStore = useAchievementStore();
        await achievementStore.fetchReqPalAchievementImages();
        return next();
    } catch (error) {
        return next({name: 'Error'});
    }
}