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
        getComponents: (state) => {
            return state.components;
        },
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
            this.components.splice(0, this.components.length);
        },
        flushStore() {
            this.lessonTitle = '';
            this.lessonDescription = '';
            this.lessonPoints = 250;
            this.clearComponents();
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
