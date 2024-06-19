import { NavigationGuardNext, RouteLocationNormalized } from "vue-router";
import {useLearningGoalsStore} from "@/stores/learningGoals.ts";

export async function fetchLearningGoalsByUser(to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) {
    try {
        const learningGoalsStore = useLearningGoalsStore();
        await learningGoalsStore.fetchLearningGoalsByUser();
        return next();
    } catch (error) {
        return next({name: 'Error'});
    }
}