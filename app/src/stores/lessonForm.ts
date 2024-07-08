import {defineStore} from 'pinia';
import {LessonForm, Question} from "@/types/lesson.ts";
import {v4 as uuidv4} from 'uuid';
import { toRaw } from "vue";

interface LessonModuleEntry {
    uuid: string;
    type: string | null;
    data: Question;
}

interface LessonFormState {
    uuid: string;
    lessonTitle: string;
    objectiveId: string | null;
    lessonDescription: string;
    lessonModules: LessonModuleEntry[];
    insertModuleIndex: number;
}

export const useLessonFormStore = defineStore('lessonForm', {
    state: (): LessonFormState => ({
        uuid: uuidv4(),
        lessonModules: [],
        lessonTitle: '',
        objectiveId: null,
        lessonDescription: '',
        insertModuleIndex: 0,
    }),
    getters: {
        isDirty: (state) => {
            return state.lessonModules.length > 0 && state.lessonTitle.length > 0 && state.lessonDescription.length > 0;
        },
        getLessonModules: (state) => {
            return state.lessonModules;
        },
        getLessonModuleValues: (state) => (componentId: string) => {
            const component = state.lessonModules.find(comp => comp.uuid === componentId);
            return component ? component.data : null;
        },
        getLessonModuleFieldValues: (state) => (componentId: string, field: string) => {
            const component = state.lessonModules.find(comp => comp.uuid === componentId);
            return component ? component.data[field] : null;
        },
        getLessonModuleFormTitle: (state) => {
            return state.lessonTitle;
        },
        getLessonModuleIndexById: (state) => (id: string) => {
            return state.lessonModules.findIndex((lessonModule) => lessonModule.uuid === id);
        },
        getLessonModuleFormDescription: (state) => {
            return state.lessonDescription;
        },
        getInsertingLessonModuleIndex: (state) => {
            return state.insertModuleIndex;
        },
    },
    actions: {
        setInsertingComponentIndex(containerIndex: number) {
            this.insertModuleIndex = containerIndex;
        },
        moveLessonModule(id: string, atIndex: number) {
            const index = this.getLessonModuleIndexById(id);
            if (index > -1 && atIndex >= 0 && atIndex < this.lessonModules.length) {
                const [component] = this.lessonModules.splice(index, 1);
                this.lessonModules.splice(atIndex, 0, component);
            }
        },
        insertComponentAt(componentName: string, index: number) {
            let uuid: string = uuidv4();
            const newComponent = {
                type: componentName,
                uuid: uuid,
                data: {uuid: uuid, question: null, options: null, solution: null, hint: null, points: null}
            };
            if (index === -1) {
                this.lessonModules.unshift(newComponent);
                return;
            }
            if (index >= 0 && index <= this.lessonModules.length) {
                this.lessonModules.splice(index, 0, newComponent);
                return;
            }
        },
        removeLessonModuleById(id: string) {
            const indexToRemove = this.lessonModules.findIndex((component) => component.uuid === id);
            this.lessonModules.splice(indexToRemove, 1);
        },
        setLessonModuleData(componentId: string, field: string, value: any) {
            const component = this.lessonModules.find(comp => comp.uuid === componentId);
            if (component && component.data.hasOwnProperty(field)) {
                component.data[field] = value;
            }
        },
        clearLessonModules() {
            this.lessonModules.splice(0, this.lessonModules.length);
            this.insertModuleIndex = 0;
        },
        flushStore() {
            this.uuid = uuidv4();
            this.lessonTitle = '';
            this.lessonDescription = '';
            this.objectiveId = null;

            this.clearLessonModules();
        },
        generateLesson(): LessonForm {
            return {
                uuid: this.uuid,
                title: this.lessonTitle,
                description: this.lessonDescription,
                objectiveId: this.objectiveId,
                questions: this.lessonModules.map(component => {
                    return {
                        uuid: component.uuid,
                        position: this.getLessonModuleIndexById(component.uuid),
                        question: component.data.question,
                        solution: toRaw(component.data.solution),
                        options: toRaw(component.data.options),
                        hint: toRaw(component.data.hint),
                        points: component.data.points,
                        type: component.type
                    }
                })
            };
        },
        hydrate(lesson: LessonForm) {
            this.flushStore();
            this.uuid = lesson.uuid;
            this.lessonTitle = lesson.title;
            this.lessonDescription = lesson.description;
            this.objectiveId = lesson.objectiveId;
            lesson.questions.forEach((question: Question) => {
                this.lessonModules.push({
                    type: question.type || null,
                    uuid: question.uuid,
                    data: {
                        uuid: question.uuid,
                        question: question.question,
                        solution: question.solution,
                        options: question.options,
                        hint: question.hint,
                        points: question.points,
                        position: question.position,
                    }
                });
            });
        }
    }
});
