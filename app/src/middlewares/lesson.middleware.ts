import {NavigationGuardNext, RouteLocationNormalized} from "vue-router";
import {useLessonStore} from "@/stores/lesson.store.ts";
import alertService from "@/services/util/alert.service.ts";


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
        console.log(error);
        return next({name: 'Error'});
    }
}

export async function fetchQuestionsForLesson(to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) {
    try {
        const lessonStore = useLessonStore();
        await lessonStore.fetchQuestionsForLesson(to.params.lessonUUID.toString());
        return next();
    } catch (error) {
        console.log(error);
        return next({name: 'Error'});
    }
}

export async function fetchUserAnswersForQuestions(to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) {
    try {
        const lessonStore = useLessonStore();

        await lessonStore.fetchQuestionsForLesson(to.params.lessonUUID.toString());
        await lessonStore.loadUserAnswersForLesson(to.params.lessonUUID.toString());
        return next();
    } catch (error) {
        console.log(error);
        return next({name: 'Error'});
    }
}

export async function loadLessonSolutionsByUUID(to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) {
    try {
        const lessonStore = useLessonStore();

        await lessonStore.loadQuestionsWithSolutionsForLesson(to.params.lessonUUID.toString());
        await lessonStore.loadUserScoreForLesson(to.params.lessonUUID.toString());
        return next();
    } catch (error) {
        console.log(error);
        return next({name: 'Error'});
    }
}

export async function nextIfLessonFinished(to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) {
    try {
        const lessonStore = useLessonStore();
        const status = await lessonStore.getStatusOfLessonForUser(to.params.lessonUUID.toString());
        if(status && status.finished && !status.is_started) {
            return next();
        } else {
            alertService.addErrorAlert("Diese Lektion wurde noch nicht abgeschlossen!")
            return next({name: 'Lessons'});
        }
    } catch (error) {
        console.log(error);
        return next({name: 'Error'});
    }
}

export async function nextIfLessonNotFinished(to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) {
    try {
        const lessonStore = useLessonStore();
        const status = await lessonStore.getStatusOfLessonForUser(to.params.lessonUUID.toString());
        if(status && (!status.finished || status.is_started)) {
            return next();
        } else {
            alertService.addErrorAlert("Diese Lektion wurde bereits abgeschlossen!")
            return next({name: 'Lessons'});
        }
    } catch (error) {
        console.log(error);
        return next({name: 'Error'});
    }
}