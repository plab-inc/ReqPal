import {defineStore} from 'pinia';
import {Question} from "@/interfaces/Question.interfaces.ts";
import {v4 as uuidv4} from 'uuid';
import {Lesson} from "@/types/lesson.types.ts";

interface ComponentEntry {
    uuid: string;
    type: string | null;
    data: Question;
}

interface LessonFormState {
    uuid: string;
    lessonTitle: string;
    lessonDescription: string;
    lessonPoints: number;
    components: ComponentEntry[];
}

export const useLessonFormStore = defineStore('lessonForm', {
    state: (): LessonFormState => ({
        uuid: uuidv4(),
        components: [],
        lessonTitle: '',
        lessonDescription: '',
        lessonPoints: 250
    }),
    getters: {
        isDirty: (state) => {
            return state.components.length > 0 && state.lessonTitle.length > 0 && state.lessonDescription.length > 0;
        },
        getComponents: (state) => {
            return state.components;
        },
        getComponentValues: (state) => (componentId: string) => {
            const component = state.components.find(comp => comp.uuid === componentId);
            return component ? component.data : null;
        },
        getComponentFieldValues: (state) => (componentId: string, field: string) => {
            const component = state.components.find(comp => comp.uuid === componentId);
            return component ? component.data[field] : null;
        },
        getLessonFormTitle: (state) => {
            return state.lessonTitle;
        },
        getComponentIndexById: (state) => (id: string) => {
            return state.components.findIndex((component) => component.uuid === id);
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
            let uuid: string  = uuidv4();
            this.components.push({
                type: componentName,
                uuid: uuid,
                data: {uuid: uuid, question: null, options: null, solution: null, hint: null}
            });
        },
        removeComponentById(id: string) {
            const indexToRemove = this.components.findIndex((component) => component.uuid === id);
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
            const component = this.components.find(comp => comp.uuid === componentId);
            if (component && component.data.hasOwnProperty(field)) {
                component.data[field] = value;
            }
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
        generateLesson(): Lesson {
            return {
                uuid: this.uuid,
                title: this.lessonTitle,
                description: this.lessonDescription,
                points: this.lessonPoints,
                questions: this.components.map(component => {
                    return {
                        uuid: component.uuid,
                        position: this.getComponentIndexById(component.uuid),
                        question: component.data.question,
                        solution: toRaw(component.data.solution),
                        options: toRaw(component.data.options),
                        hint: toRaw(component.data.hint),
                        type: component.type
                    }
                })
            };
        },
        hydrate(lesson: Lesson) {
            this.flushStore();
            this.uuid = lesson.uuid;
            this.lessonTitle = lesson.title;
            this.lessonDescription = lesson.description;
            this.lessonPoints = lesson.points;
            lesson.questions.forEach((question: Question) => {
                this.components.push({
                    type: question.type || null,
                    uuid: question.uuid,
                    data: {
                        uuid: question.uuid,
                        question: question.question,
                        solution: question.solution,
                        options: question.options,
                        hint: question.hint,
                        position: question.position,
                    }
                });
            });
        }
    }
});
