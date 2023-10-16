import {NavigationGuardNext, RouteLocationNormalized} from "vue-router";
import {useLessonStore} from "@/stores/lesson.store.ts";


export async function fetchLessons(to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) {
    try {
        const catalogStore = useLessonStore();
        await catalogStore.fetchLessons();
        return next();
    } catch (error) {
        return next({name: 'Error'});
    }
}
export async function fetchQuestionsForLesson(to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) {
    try {
        const catalogStore = useLessonStore();
        await catalogStore.fetchQuestionsForLesson(parseInt(to.params.lessonId as string));
        return next();
    } catch (error) {
        return next({name: 'Error'});
    }
}