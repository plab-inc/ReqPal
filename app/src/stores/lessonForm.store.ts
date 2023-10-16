import {defineStore} from 'pinia';
import {Question} from "@/interfaces/Question.interfaces.ts";

interface ComponentEntry {
    id: number;
    position: number;
    name: string;
    data: Question;
}

interface LessonFormState {
    lessonTitle: string;
    lessonDescription: string;
    lessonPoints: number;
    components: ComponentEntry[];
    nextId: number;
}

export const useLessonFormStore = defineStore('lessonForm', {
    state: (): LessonFormState => ({
        components: [],
        nextId: 1,
        lessonTitle: '',
        lessonDescription: '',
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
        getLessonFormDescription: (state) => {
            return state.lessonDescription;
        },
        getLessonFormPoints: (state) => {
            return state.lessonPoints;
        },
    },
    actions: {
        addComponent(componentName: string) {
            this.components.push({
                name: componentName,
                position: 0,
                id: this.nextId++,
                data: {question: null, options: null, solution: null, hint: null}
            });
        },
        removeComponentById(id: number) {
            const indexToRemove = this.components.findIndex((component) => component.id === id);
            this.components.splice(indexToRemove, 1);
        },
        switchComponentWithPrevById(id: number) {
            const indexToSwitch = this.components.findIndex((component) => component.id === id);
            if (indexToSwitch > -1 && indexToSwitch > 0) {
                const prevIndex = indexToSwitch - 1;
                this.switchComponentsByIndex(prevIndex, indexToSwitch);
            }
        },
        switchComponentWithPostById(id: number) {
            const indexToSwitch = this.components.findIndex((component) => component.id === id);
            if (indexToSwitch > -1 && indexToSwitch < this.components.length) {
                const postIndex = indexToSwitch + 1;
                this.switchComponentsByIndex(postIndex, indexToSwitch);
            }
        },
        setComponentData(componentId: number, field: string, value: any) {
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
        setLessonDescription(description: string) {
            this.lessonDescription = description;
        },
        clearComponents() {
            this.components = [];
        },
        componentsToJSON() {
            console.log(JSON.stringify(this.components));
        },

        switchComponentsByIndex(otherIndex: number, indexToSwitch: number) {
            const prevComponent = this.components[otherIndex];
            if (prevComponent) {
                const currentComponent = this.components[indexToSwitch];
                const prevId = prevComponent.id;
                prevComponent.id = currentComponent.id;
                currentComponent.id = prevId;
                this.components[indexToSwitch] = prevComponent;
                this.components[otherIndex] = currentComponent;
            }
        }
    }
});
