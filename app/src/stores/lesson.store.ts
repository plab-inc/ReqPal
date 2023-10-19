import {defineStore} from 'pinia';
import {Lesson} from "@/types/lesson.types";
import lessonService from "@/services/database/lesson.service.ts";
import {Question} from "@/interfaces/Question.interfaces.ts";
import {v1 as uuidv1} from "uuid";

interface LessonState {
    lessons: Lesson[];
    currentLesson: Lesson | null;
    currentQuestions: any;
    lessonsLoaded: Boolean;
    components: ComponentEntry[];
}

interface ComponentEntry {
    id: string;
    type: string;
    data: Question;
}

export const useLessonStore = defineStore('lesson', {
    state: (): LessonState => ({
        lessons: [],
        currentLesson: null,
        currentQuestions: [],
        lessonsLoaded: false,
        components: []
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
        getComponentFieldValues: (state) => (componentId: string, field: string) => {
            const component = state.components.find(comp => comp.id === componentId);
            return component ? component.data[field] : null;
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
        },
        addComponentWithData(componentName: string, data: { question: any, options: any, solution: any, hint: any }) {
            this.components.push({
                type: componentName,
                id: uuidv1(),
                data: data
            });
        },
        setComponentData(componentId: string, field: string, value: any) {
            const component = this.components.find(comp => comp.id === componentId);
            if (component && component.data.hasOwnProperty(field)) {
                component.data[field] = value;
            }
        },
    },
});
