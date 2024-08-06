import { NavigationGuardNext, RouteLocationNormalized } from "vue-router";
import { useLessonStore } from "@/stores/lesson.ts";

export async function fetchLessons(to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) {
    try {
        const lessonStore = useLessonStore();
        await lessonStore.fetchLessons();
        return next();
    } catch (error) {
        return next({name: 'Error'});
    }
}

export async function loadLessonByUUID(to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) {
    try {
        const lessonStore = useLessonStore();
        await lessonStore.fetchLessons();
        lessonStore.loadLessonByUUID(to.params.lessonUUID.toString());
        return next();
    } catch (error) {
        return next({name: 'Error'});
    }
}

export async function fetchQuestionsForLesson(to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) {
    try {
        const lessonStore = useLessonStore();
      await lessonStore.fetchLessonWithQuestions(to.params.lessonUUID.toString());
        return next();
    } catch (error) {
        return next({name: 'Error'});
    }
}