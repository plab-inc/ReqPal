import {NavigationGuardNext, RouteLocationNormalized} from "vue-router";
import {useLessonStore} from "@/stores/lesson.store.ts";


export async function fetchLessons(to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) {
    try {
        const lessonStore = useLessonStore();
        await lessonStore.fetchLessons();
        return next();
    } catch (error) {
        return next({name: 'Error'});
    }
}

export async function loadLessonById(to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) {
    try {
        const lessonStore = useLessonStore();
        if (lessonStore.lessons.length <= 0) {
            await lessonStore.fetchLessons();
        }
        lessonStore.loadLessonById(parseInt(to.params.lessonId as string));
        return next();
    } catch (error) {
        return next({name: 'Error'});
    }
}

export async function fetchQuestionsForLesson(to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) {
    try {
        const lessonStore = useLessonStore();
        await lessonStore.fetchQuestionsForLesson(parseInt(to.params.lessonId as string));
        return next();
    } catch (error) {
        return next({name: 'Error'});
    }
}