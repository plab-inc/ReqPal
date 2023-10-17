import {defineStore} from 'pinia';
import {Question} from "@/interfaces/Question.interfaces.ts";
import {v1 as uuidv1} from 'uuid';

interface ComponentEntry {
    id: string;
    type: string;
    data: Question;
}

interface LessonFormState {
    lessonTitle: string;
    lessonDescription: string;
    lessonPoints: number;
    components: ComponentEntry[];
}

export const useLessonFormStore = defineStore('lessonForm', {
    state: (): LessonFormState => ({
        components: [],
        lessonTitle: '',
        lessonDescription: '',
        lessonPoints: 250
    }),
    getters: {
        getComponentValues: (state) => (componentId: string) => {
            const component = state.components.find(comp => comp.id === componentId);
            return component ? component.data : null;
        },
        getComponentFieldValues: (state) => (componentId: string, field: string) => {
            const component = state.components.find(comp => comp.id === componentId);
            return component ? component.data[field] : null;
        },
        getLessonFormTitle: (state) => {
            return state.lessonTitle;
        },
        getComponentIndexById: (state) => (id: string) => {
            return state.components.findIndex((component) => component.id === id);
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
                type: componentName,
                id: uuidv1(),
                data: {question: null, options: null, solution: null, hint: null}
            });
        },
        addComponentWithData(componentName: string, data : {question: any, options: any, solution: any, hint: any}) {
            this.components.push({
                type: componentName,
                id: uuidv1(),
                data: data
            });
        },
        removeComponentById(id: string) {
            const indexToRemove = this.components.findIndex((component) => component.id === id);
            this.components.splice(indexToRemove, 1);
        },
        switchComponentWithPrevById(id: string) {
            const index = this.getComponentIndexById(id);

            if (index > 0) {
                const temp = this.components[index];
                this.components[index] = this.components[index - 1];
                this.components[index - 1] = temp;
            }
        },
        switchComponentWithPostById(id: string) {
            const index = this.getComponentIndexById(id);

            if (index > -1 && index < this.components.length - 1) {
                const temp = this.components[index];
                this.components[index] = this.components[index + 1];
                this.components[index + 1] = temp;
            }
        },
        setComponentData(componentId: string, field: string, value: any) {
            const component = this.components.find(comp => comp.id === componentId);
            console.log("set data")
            console.log(componentId)
            console.log(this.components)
            console.log(component)
            if (component && component.data.hasOwnProperty(field)) {
                console.log(component)
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
            console.log(this.generateLessonJSON());
        },
        generateLessonJSON(){
            return {
                title: this.lessonTitle,
                description: this.lessonDescription,
                points: this.lessonPoints,
                questions: this.components.map(component => {
                    return {
                        type: component.type,
                        position: this.getComponentIndexById(component.id),
                        question: component.data.question,
                        solution: toRaw(component.data.solution),
                        options: toRaw(component.data.options),
                        hint: toRaw(component.data.hint)
                    }
                })
            };
        }
    }
});
