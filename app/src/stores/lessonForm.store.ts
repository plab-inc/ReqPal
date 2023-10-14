import {defineStore} from 'pinia';
import {multipleChoiceAnswer, QuestionModel, trueOrFalseAnswer} from "@/interfaces/Question.interfaces.ts";

interface ComponentEntry {
    id: number;
    name: string;
    data: QuestionModel;
}

interface LessonFormState {
    lessonTitle: string;
    lessonPoints: number;
    components: ComponentEntry[];
    nextId: number;
}

export const useLessonFormStore = defineStore('lessonForm', {
    state: (): LessonFormState => ({
        components: [],
        nextId: 1,
        lessonTitle: '',
        lessonPoints: 250
    }),
    getters: {
        getComponentValues: (state) => (componentId: number) => {
            const component = state.components.find(comp => comp.id === componentId);
            return component ? component.data : null;
        },
        getComponentFieldValues: (state) => (componentId: number, field: string) => {
            const component = state.components.find(comp => comp.id === componentId);
            return component ? component.data[field] : null;
        },
        getLessonFormTitle: (state) => {
            return state.lessonTitle;
        },
        getLessonFormPoints: (state) => {
            return state.lessonPoints;
        },
    },
    actions: {
        addComponent(componentName: string) {
            this.components.push({name: componentName, id: this.nextId++, data: { question: null, solution: null, hint: null, requirement: null }});
        },
        removeComponentById(id: number) {
            const indexToRemove = this.components.findIndex((component) => component.id === id);
            this.components.splice(indexToRemove, 1);
        },
        setComponentData(componentId: number, field: string, value: string | boolean | number | null | undefined | trueOrFalseAnswer | multipleChoiceAnswer | multipleChoiceAnswer[]) {
            const component = this.components.find(comp => comp.id === componentId);
            if (component && component.data.hasOwnProperty(field)) {
                component.data[field] = value;
            }
        },
        setLessonPoints(points: number) {
            this.lessonPoints = points;
        },
        setLessonTitle(title: string) {
            this.lessonTitle = title;
        },
        clearComponents() {
            this.components = [];
        },
        componentsToJSON() {
            return JSON.stringify(this.components);
        }
    }
});
