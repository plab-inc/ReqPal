import {defineStore} from 'pinia';
import {Lesson, Question, questionTypes} from "@/types/lesson.types";
import lessonService from "@/services/database/lesson.service.ts";

interface LessonState {
    lessons: Lesson[];
    currentLesson: Lesson | null;
    currentQuestions: Question[];
    lessonsLoaded: Boolean;
}

export const useLessonStore = defineStore('lesson', {
    state: (): LessonState => ({
        lessons: [],
        currentLesson: null,
        currentQuestions: [],
        lessonsLoaded: false,
    }),

    getters: {
        getAllLessons: state => {
            return state.lessons;
        },

        getLessonById: (state) => {
            return state.currentLesson;
        },

        getAllQuestions: state => {
            return state.currentQuestions;
        },

    },

    actions: {
        async fetchQuestionsForLesson(lessonId: number) {
            const questions = await lessonService.pull.fetchQuestionsForLesson(lessonId);
            if (questions) {
                this.currentQuestions = questions;
            }
        },
    },
});
