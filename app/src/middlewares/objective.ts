import {NavigationGuardNext, RouteLocationNormalized} from "vue-router";
import {useObjectiveStore} from "@/stores/objective.ts";
import {useLessonStore} from "@/stores/lesson.ts";
import {useLessonFormStore} from "@/stores/lessonForm.ts";
import {useAuthStore} from "@/stores/auth.ts";

export async function fetchObjectivesByUser(to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) {
    try {
        const objectiveStore = useObjectiveStore();
        await objectiveStore.fetchObjectivesByUser();
        return next();
    } catch (error) {
        return next({name: 'Error'});
    }
}

export async function fetchObjectivesByLessonOwner(to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) {
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
            const objectiveStore = useObjectiveStore();
            await objectiveStore.fetchObjectivesByUserId(ownerId);
        }

        return next();
    } catch (error) {
        return next({name: 'Error'});
    }
}