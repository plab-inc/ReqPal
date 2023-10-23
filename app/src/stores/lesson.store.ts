import {defineStore} from 'pinia';
import {LessonDTO} from "@/types/lesson.types";
import lessonService from "@/services/database/lesson.service.ts";
import {Question} from "@/interfaces/Question.interfaces.ts";
import {DatabaseError} from "@/errors/custom.errors.ts";

interface LessonState {
    examples: LessonDTO[],
    lessons: LessonDTO[];
    currentLesson: LessonDTO | null;
    currentQuestions: any;
    lessonsLoaded: Boolean;
    components: ComponentEntry[];
}

interface ComponentEntry {
    uuid: string;
    type: string;
    data: Question;
}

export const useLessonStore = defineStore('lesson', {
    state: (): LessonState => ({
        examples: [],
        lessons: [],
        currentLesson: null,
        currentQuestions: [],
        lessonsLoaded: false,
        components: []
    }),

    getters: {
        getLessons: state => {
            return state.lessons.sort((a, b) => {
                return a.created_at.localeCompare(b.created_at);
            });
        },
        getCurrentLesson: (state) => {
            return state.currentLesson;
        },
        getExampleLessons: state => {
            return state.examples;
        },
        getCurrentQuestion: state => {
            return state.currentQuestions;
        },
        getSortedCurrentQuestions: (state) => {
            return [...state.currentQuestions].sort((a, b) => a.position - b.position);
        },
        getComponentFieldValues: (state) => (componentId: string, field: string) => {
            const component = state.components.find(comp => comp.uuid === componentId);
            return component ? component.data[field] : null;
        },
    },

    actions: {
        async fetchQuestionsForLesson(lessonUUID: string) {
            const questions = await lessonService.pull.fetchQuestionsForLesson(lessonUUID);
            if (Array.isArray(questions)) {
                this.currentQuestions = questions;
            }

        },
        async fetchLessons() {
            const lessons = await lessonService.pull.fetchLessons();
            if (lessons) {
                this.lessons = lessons;
            }
            const exampleLessons = await lessonService.pull.fetchLessons(true);
            if (exampleLessons) {
                this.examples = exampleLessons;
                console.log(this.examples);
            }
        },
        async deleteLesson(lessonUUID: string) {
            await lessonService.push.deleteLesson(lessonUUID).then(
                (data: LessonDTO[]) => {
                    if(data.length > 0) {
                        this.lessons.splice(this.lessons.findIndex(c => c.uuid === lessonUUID), 1);
                        return;
                    }
                    throw new DatabaseError("Catalog could not be deleted", 500);
                }
            );
        },
        loadLessonByUUID(lessonUUID: string) {
            const lesson = this.lessons.find(lesson => lesson.uuid === lessonUUID);
            if (lesson) {
                this.currentLesson = lesson;
            }
        },
        addComponentWithData(componentName: string, componentUUID: string, data: { uuid: string, question: any, options: any, solution: any, hint: any }) {
            this.components.push({
                type: componentName,
                uuid: componentUUID,
                data: data
            });
        },
        setComponentData(componentId: string, field: string, value: any) {
            const component = this.components.find(comp => comp.uuid === componentId);
            if (component && component.data.hasOwnProperty(field)) {
                component.data[field] = value;
            }
        },
    },
});
