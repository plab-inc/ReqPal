import { NavigationGuardNext, RouteLocationNormalized } from "vue-router";
import {useLearningGoalsStore} from "@/stores/learningGoals.ts";

export async function fetchLearningGoalsByUser(to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) {
    try {
        const learningGoalsStore = useLearningGoalsStore();
        await learningGoalsStore.fetchLearningGoals();
        return next();
    } catch (error) {
        return next({name: 'Error'});
    }
}