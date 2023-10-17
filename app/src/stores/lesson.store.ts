import {defineStore} from 'pinia';
import {Lesson} from "@/types/lesson.types";
import lessonService from "@/services/database/lesson.service.ts";

interface LessonState {
    lessons: Lesson[];
    currentLesson: Lesson | null;
    currentQuestions: any;
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
        getLessons: state => {
            return state.lessons;
        },

        getCurrentLesson: (state) => {
            return state.currentLesson;
        },

        getCurrentQuestion: state => {
            return state.currentQuestions;
        },
        getSortedCurrentQuestions: (state) => {
            return [...state.currentQuestions].sort((a, b) => a.position - b.position);
        },

    },

    actions: {
        async fetchQuestionsForLesson(lessonId: number) {
            const questions = await lessonService.pull.fetchQuestionsForLesson(lessonId);
            if (Array.isArray(questions)) {
                this.currentQuestions = questions;
            }

        },
        async fetchLessons() {
            const lessons = await lessonService.pull.fetchLessons();
            if (lessons) {
                this.lessons = lessons;
            }
        },
        loadLessonById(lessonId: number) {
            const lesson = this.lessons.find(lesson => lesson.id === lessonId);
            if (lesson) {
                this.currentLesson = lesson;
            }
        }
    },
});
