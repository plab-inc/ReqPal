import {defineStore} from 'pinia';
import {LessonAnswer, LessonDTO, UserAnswer} from "@/types/lesson.types";
import lessonService from "@/services/database/lesson.service.ts";
import {Question} from "@/interfaces/Question.interfaces.ts";
import {DatabaseError} from "@/errors/custom.errors.ts";
import {useAuthStore} from "@/stores/auth.store.ts";

interface LessonState {
    examples: LessonDTO[],
    lessons: LessonDTO[];
    currentLesson: LessonDTO | null;
    currentQuestions: any;
    components: ComponentEntry[];
    lessonFinished: boolean;
    scoredPoints: number;
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
        components: [],
        lessonFinished: false,
        scoredPoints: 0
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
            }
        },

        async deleteLesson(lessonUUID: string) {
            await lessonService.push.deleteLesson(lessonUUID).then(
                (data: LessonDTO[]) => {
                    if (data.length > 0) {
                        this.lessons.splice(this.lessons.findIndex(c => c.uuid === lessonUUID), 1);
                        return;
                    }
                    throw new DatabaseError("Catalog could not be deleted", 500);
                }
            );
        },

        loadLessonByUUID(lessonUUID: string) {
            if (this.currentLesson?.uuid === lessonUUID) return;
            this.lessonFinished = false;
            this.clearComponents();
            const lesson = this.lessons.find(lesson => lesson.uuid === lessonUUID);
            if (lesson) {
                this.currentLesson = lesson;
            } else {
                const lesson = this.examples.find(lesson => lesson.uuid === lessonUUID);
                if (lesson) {
                    this.currentLesson = lesson;
                }
            }
        },

        addComponentWithData(componentName: string, componentUUID: string, data: {
            uuid: string,
            question: any,
            options: any,
            solution: any,
            hint: any
        }) {
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

        generateUserResults(): LessonAnswer | null {
            const questions = this.filterComponentsByQuestionOnly();
            if (this.currentLesson) {
                return {
                    uuid: this.currentLesson?.uuid,
                    usedHints: 0,
                    answers: questions.map(component => {
                        return {
                            uuid: component.uuid,
                            question: component.data.question,
                            options: toRaw(component.data.options),
                            type: component.type
                        }
                    })
                };
            }
            return null;
        },

        async submitUserAnswers(answers: any) {
            await lessonService.push.uploadUserAnswers(answers);
        },

        async loadQuestionsWithSolutionsForLesson(lessonUUID: string) {
            const data = await lessonService.pull.fetchQuestionsWithSolutionsForLesson(lessonUUID);
            if (data) {
                this.currentQuestions = data;

                data.forEach(d => {
                    let component = this.components.find(component => component.data.uuid === d.uuid);
                    if (component) {
                        component.data.solution = d.solution;
                    }
                })
            }
        },

        filterComponentsByQuestionOnly() {
            return this.components.filter(c =>
                c.type === 'MultipleChoice' ||
                c.type === 'TrueOrFalse' ||
                c.type === 'Slider')
        },

        clearComponents() {
            this.components = [];
        },

        async loadUserScoreForLesson(lessonUUID: string) {
            const authStore = useAuthStore();
            if (authStore.user && this.lessonFinished) {
                const data = await lessonService.pull.fetchUserScoreForLesson(lessonUUID, authStore.user.id);
                if (data) {
                    let score = 0;
                    data.forEach(d => {
                        score += d.result.score;
                    })
                    this.scoredPoints = Math.round(score);
                }
            }
        },

        async resetUserAnswersForLesson(lessonUUID: string) {
            const authStore = useAuthStore();
            if (authStore.user) {
                await lessonService.push.deleteUserAnswersForLesson(lessonUUID, authStore.user.id);
            }
        },

        async loadUserAnswersForLesson(lessonUUID: string) {
            const authStore = useAuthStore();
            if (authStore.user) {
                const data = await lessonService.pull.fetchLessonFinishedForUser(lessonUUID, authStore.user.id);
                if (data && data.finished) {
                    this.lessonFinished = true;
                    const answers = await lessonService.pull.fetchLessonUserAnswers(lessonUUID, authStore.user.id);
                    if (answers) {
                        this.hydrate(answers);
                    }
                }
            }
        },

        hydrate(answers: UserAnswer[]) {
            this.clearComponents();

            this.currentQuestions.forEach((q: Question) => {
                this.addComponentWithData(q.question_type, q.uuid, {
                    uuid: q.uuid,
                    question: q.question,
                    options: q.options,
                    solution: q.solution,
                    hint: q.hint
                })
            })

            answers.forEach(answer => {
                const comp =
                    this.components.find(c => c.uuid === answer.question_id);
                if (comp) comp.data.options = answer.answer;
            });
        }

    },
});
