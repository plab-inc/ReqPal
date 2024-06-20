import {NavigationGuardNext, RouteLocationNormalized} from "vue-router";
import {useLearningGoalsStore} from "@/stores/learningGoals.ts";
import {useLessonStore} from "@/stores/lesson.ts";
import {useLessonFormStore} from "@/stores/lessonForm.ts";
import {useAuthStore} from "@/stores/auth.ts";

export async function fetchLearningGoalsByUser(to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) {
    try {
        const learningGoalsStore = useLearningGoalsStore();
        await learningGoalsStore.fetchLearningGoalsByUser();
        return next();
    } catch (error) {
        return next({name: 'Error'});
    }
}

export async function fetchLearningGoalsByLessonOwner(to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) {
    try {
        const lessonStore = useLessonStore();
        const lessonFormStore = useLessonFormStore();
        const authStore = useAuthStore();

        const lessons = lessonStore.getLessons;
        const lessonId = lessonFormStore.uuid;
        const foundLesson = lessons.find(l => l.lessonDTO.uuid === lessonId);

        if (authStore.user) {
            let ownerId: string = authStore.user.id;

            if (foundLesson) {
                if (authStore.user.id !== foundLesson.lessonDTO.user_id) {
                    ownerId = foundLesson.lessonDTO.user_id;
                }
            }
            const learningGoalsStore = useLearningGoalsStore();
            await learningGoalsStore.fetchLearningGoalsByUserId(ownerId);
        }

        return next();
    } catch (error) {
        return next({name: 'Error'});
    }
}