import {NavigationGuardNext, RouteLocationNormalized, RouteParamValue} from "vue-router";
import { useLessonStore } from "@/stores/lesson.store";

export async function fetchLessonById(to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) {
    const lessonId = to.params.lessonId as string | undefined;

    if (!lessonId) {
        return next({ name: 'Error' });
    }

    const lessonStore = useLessonStore();
    await lessonStore.fetchLessonById(lessonId);

    if (lessonStore.currentLesson) {
        await lessonStore.fetchQuestionsForLesson(lessonId);
        return next();
    } else {
        return next({ name: 'Error' });
    }
}

export async function fetchLessons(to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) {
    try {
        const lessonStore = useLessonStore();
        await lessonStore.fetchLessons();
        return next();
    } catch (error) {
        return next({ name: 'Error' });
    }
}