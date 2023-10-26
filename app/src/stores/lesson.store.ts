import {defineStore} from 'pinia';
import {Lesson, LessonAnswer, LessonDTO, UserAnswer} from "@/types/lesson.types";
import lessonService from "@/services/database/lesson.service.ts";
import {Question} from "@/interfaces/Question.interfaces.ts";
import {DatabaseError} from "@/errors/custom.errors.ts";
import {useAuthStore} from "@/stores/auth.store.ts";

interface LessonState {
    examples: Lesson[],
    lessons: Lesson[];
    currentLesson: Lesson | null;
    currentQuestions: any;
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
        components: [],
    }),

    getters: {
        getLessons: state => {
            return state.lessons.sort((a, b) => {
                return a.lessonDTO.created_at.localeCompare(b.lessonDTO.created_at);
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
            this.lessons = [];
            this.examples = [];

            if (lessons) {
                this.lessons = lessons.map((l) => ({
                    lessonDTO: l,
                    isFinished: false,
                    userScore: 0
                }));
            }


            const exampleLessons = await lessonService.pull.fetchLessons(true);

            if (exampleLessons) {
                this.examples = exampleLessons.map((l) => ({
                    lessonDTO: l,
                    isFinished: false,
                    userScore: 0
                }));
            }
            await this.initLessons(this.lessons);
            await this.initLessons(this.examples);
        },

        async initLessons(lessons: Lesson[]) {
            for (const l of lessons) {
                const isFinished = await this.isLessonFinished(l.lessonDTO.uuid);
                l.isFinished = isFinished ? isFinished : false;
                await this.loadUserScoreForLesson(l.lessonDTO.uuid);
            }
        },

        async deleteLesson(lessonUUID: string) {
            await lessonService.push.deleteLesson(lessonUUID).then(
                (data: LessonDTO[]) => {
                    if (data.length > 0) {
                        this.lessons.splice(this.lessons.findIndex(c => c.lessonDTO.uuid === lessonUUID), 1);
                        return;
                    }
                    throw new DatabaseError("Catalog could not be deleted", 500);
                }
            );
        },

        loadLessonByUUID(lessonUUID: string) {
            if (this.currentLesson?.lessonDTO.uuid === lessonUUID) return;
            this.clearComponents();
            const lesson = this.findLesson(lessonUUID);
            if (lesson) {
                this.currentLesson = lesson;
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
                    uuid: this.currentLesson?.lessonDTO.uuid,
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
            let lesson = this.findLesson(lessonUUID);
            if (lesson) {
                if (authStore.user && lesson.isFinished) {
                    const data = await lessonService.pull.fetchUserScoreForLesson(lessonUUID, authStore.user.id);
                    if (data) {
                        let score = 0;
                        data.forEach(d => {
                            score += d.result.score;
                        })
                        lesson.userScore = Math.round(score);
                    }
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
            let lesson = this.findLesson(lessonUUID);

            if (authStore.user && lesson) {
                const isFinished = await this.isLessonFinished(lessonUUID);
                if (isFinished) {
                    lesson.isFinished = true;
                    const answers = await lessonService.pull.fetchLessonUserAnswers(lessonUUID, authStore.user.id);
                    if (answers) {
                        this.hydrate(answers);
                    }
                }
            }
        },

        async isLessonFinished(lessonUUID: string) {
            const authStore = useAuthStore();
            if (authStore.user) {
                const isFinished = await lessonService.pull.fetchLessonFinishedForUser(lessonUUID, authStore.user.id);
                if (isFinished && isFinished.finished) return isFinished.finished;
                return false;
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
        },

        findLesson(lessonUUID: string) {
            let lesson = this.lessons.find(l => l.lessonDTO.uuid === lessonUUID);
            if (!lesson) {
                lesson = this.examples.find(l => l.lessonDTO.uuid === lessonUUID);
            }
            return lesson;
        }

    },
});
