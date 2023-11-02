import {defineStore} from 'pinia';
import {Lesson, LessonAnswer, LessonDTO, UserAnswer} from "@/types/lesson.types";
import lessonService from "@/services/database/lesson.service.ts";
import {Question} from "@/interfaces/Question.interfaces.ts";
import {DatabaseError} from "@/errors/custom.errors.ts";
import {useAuthStore} from "@/stores/auth.store.ts";
import LessonService from "@/services/database/lesson.service.ts";

interface LessonState {
    examples: Lesson[],
    lessons: Lesson[];
    currentLesson: Lesson | null;
    currentQuestions: any;
    components: ComponentEntry[];
}

export interface ComponentEntry {
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
        getComponents: (state) => {
            return state.components;
        },
    },

    actions: {
        async fetchQuestionsForLesson(lessonUUID: string) {
            const questions = await lessonService.pull.fetchQuestionsForLesson(lessonUUID);
            if (Array.isArray(questions)) {
                this.currentQuestions = questions;
                this.setUpComponents();
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
                    isStarted: false,
                    userScore: 0
                }));
            }


            const exampleLessons = await lessonService.pull.fetchLessons(true);

            if (exampleLessons) {
                this.examples = exampleLessons.map((l) => ({
                    lessonDTO: l,
                    isFinished: false,
                    isStarted: false,
                    userScore: 0
                }));
            }
            await this.initLessons(this.lessons);
            await this.initLessons(this.examples);
        },

        async initLessons(lessons: Lesson[]) {
            for (const l of lessons) {
                const status = await this.getStatusOfLessonForUser(l.lessonDTO.uuid);
                l.isFinished = status && (status.finished !== null) ? status.finished : false;
                l.isStarted = status && (status.is_started !== null) ? status.is_started : true;
                await this.loadFirstUserScoreForLesson(l.lessonDTO.uuid);
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
            await lessonService.push.uploadUserAnswers(answers).then(() => {
                if (this.currentLesson) {
                    this.currentLesson.isFinished = true;
                    this.currentLesson.isStarted = false;
                }
            });
        },

        async loadQuestionsWithSolutionsForLesson(lessonUUID: string) {
            const authStore = useAuthStore();
            let lesson = this.findLesson(lessonUUID);
            if (authStore.isTeacher || (lesson?.isFinished && !lesson.isStarted)) {
                const data = await lessonService.pull.fetchQuestionsWithSolutionsForLesson(lessonUUID);

                if (data) {
                    this.currentQuestions = data;
                    this.setUpComponents();
                    data.forEach(d => {
                        let component = this.components.find(component => component.data.uuid === d.uuid);
                        if (component) {
                            component.data.solution = d.solution;
                        }
                    })
                }
            }
        },

        filterComponentsByQuestionOnly() {
            return this.components.filter(c =>
                c.type === 'MultipleChoice' ||
                c.type === 'TrueOrFalse' ||
                c.type === 'Slider' ||
                c.type === 'Products')
        },

        clearComponents() {
            this.components = [];
        },

        async getUserResultsForLesson(lessonUUID: string) {
            const authStore = useAuthStore();
            let lesson = this.findLesson(lessonUUID);
            let score = 0;
            if (lesson) {
                if (authStore.user && lesson.isFinished) {
                    const data = await lessonService.pull.fetchUserScoreForLesson(lessonUUID, authStore.user.id);
                    if (data) {
                        data.forEach(d => {
                            score += d.result.score;
                        })
                    } else {
                        return -1;
                    }
                }
            }
            return Math.round(score);
        },

        async loadFirstUserScoreForLesson(lessonUUID: string) {
            const authStore = useAuthStore();
            let lesson = this.findLesson(lessonUUID);
            if (lesson) {
                if (authStore.user && lesson.isFinished) {
                    const points = await lessonService.pull.fetchFirstUserScoreForLesson(lessonUUID, authStore.user.id);
                    if (points !== null) {
                        lesson.userScore = Math.round(points);
                    } else {
                        lesson.userScore = -1;
                    }
                }
            }
        },

        async restartLessonForUser(lessonUUID: string) {
            const authStore = useAuthStore();
            if (authStore.user) {
                const data = await lessonService.push.setLessonStartedStatus(lessonUUID, authStore.user.id, true);
                if (data) {
                    const lesson = this.findLesson(lessonUUID);
                    if (lesson) {
                        lesson.isStarted = true;
                    }
                }
            }

            this.clearComponents();
        },

        async loadUserAnswersForLesson(lessonUUID: string) {
            const authStore = useAuthStore();
            let lesson = this.findLesson(lessonUUID);

            if (authStore.user && lesson) {
                const status = await this.getStatusOfLessonForUser(lessonUUID);
                if (status && !status.is_started) {
                    const answers = await lessonService.pull.fetchLessonUserAnswers(lessonUUID, authStore.user.id);
                    if (answers) {
                        this.hydrateUserAnswers(answers);
                    }
                }
            }
        },

        async getStatusOfLessonForUser(lessonUUID: string) {
            const authStore = useAuthStore();
            const lesson = this.findLesson(lessonUUID);
            if (authStore.user && lesson) {
                const status = await lessonService.pull.fetchLessonStatusForUser(lessonUUID, authStore.user.id);
                if (status) {
                    return status;
                }
            }
        },

        async checkLessonFinishedForFirstTime(lessonUUID: string) {
            const authStore = useAuthStore();
            if (authStore.user) {
                const status = await lessonService.pull.fetchLessonStatusForUser(lessonUUID, authStore.user.id);
                if (status) {
                    return status.finished_for_first_time;
                }
            }
        },

        setUpComponents() {
            this.clearComponents();

            if (this.currentQuestions.length > 0) {
                const sortedQuestions = this.getSortedCurrentQuestions;
                sortedQuestions.forEach(q => {
                    this.addComponentWithData(q.question_type, q.uuid, {
                        uuid: q.uuid,
                        question: q.question,
                        options: q.options,
                        solution: q.solution,
                        hint: q.hint
                    })
                })
            }
        },

        hydrateUserAnswers(answers: UserAnswer[]) {
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
        },

        async getLessonStatistics(lessonUUID: string) {
            const authStore = useAuthStore();
            if (authStore.isTeacher) {
                return await LessonService.pull.fetchLessonStatistics(lessonUUID);
            }
        },

        async getCountOfStudentsForTeacher() {
            const authStore = useAuthStore();
            if (authStore.isTeacher && authStore.user) {
                return await LessonService.pull.getCountOfStudentsForTeacher(authStore.user.id);
            }
        },

        async uploadUserProgressToLesson(lessonAnswers: LessonAnswer) {
            const authStore = useAuthStore();
            if (!authStore.isTeacher && authStore.user) {
                await LessonService.push.uploadUserProgressToLesson(authStore.user.id, lessonAnswers);
            }
        },

        async fetchUserProgressForLesson(lessonUUID: string) {
            const authStore = useAuthStore();
            if (!authStore.isTeacher && authStore.user && this.currentLesson?.isStarted) {
                const data = await LessonService.pull.fetchUserProgressForLesson(authStore.user.id, lessonUUID);

                if (data) {
                    if (data.answers && Array.isArray(data.answers)) {
                        const questionsWithAnswers: UserAnswer[] = data.answers.map((a: any) => ({
                            question_id: a.uuid,
                            answer: a.options
                        }));
                        this.hydrateUserAnswers(questionsWithAnswers);
                    }
                }
            }
        }

    },
});
