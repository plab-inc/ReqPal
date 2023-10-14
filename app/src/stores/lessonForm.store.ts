import {defineStore} from 'pinia';
import {QuestionModel} from "@/interfaces/Question.interfaces.ts";

interface ComponentEntry {
    id: number;
    name: string;
    data: QuestionModel;
}

interface LessonFormState {
    components: ComponentEntry[];
    nextId: number;
}

export const useLessonFormStore = defineStore('lessonForm', {
    state: (): LessonFormState => ({
        components: [],
        nextId: 1,
    }),
    getters: {
        getComponentValues: (state) => (componentId: number) => {
            const component = state.components.find(comp => comp.id === componentId);
            return component ? component.data : null;
        },
        getComponentFieldValues: (state) => (componentId: number, field: string) => {
            const component = state.components.find(comp => comp.id === componentId);
            return component ? component.data[field] : null;
        }
    },
    actions: {
        addComponent(componentName: string) {
            this.components.push({name: componentName, id: this.nextId++, data: { question: null, solution: null, hint: null, requirement: null }});
        },
        removeComponentById(id: number) {
            const indexToRemove = this.components.findIndex((component) => component.id === id);
            this.components.splice(indexToRemove, 1);
        },
        setComponentData(componentId: number, field: string, value: string | boolean | number | null | JSON | undefined) {
            const component = this.components.find(comp => comp.id === componentId);
            if (component && component.data.hasOwnProperty(field)) {
                component.data[field] = value;
            }
        },
        componentsToJSON() {
            return JSON.stringify(this.components);
        },
        clearComponents() {
            //TODO Not working
            this.components = [];
        }
    }
});
