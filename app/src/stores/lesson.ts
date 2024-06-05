import {defineStore} from 'pinia';
import {Lesson, LessonAnswer, LessonDTO, Question, UserAnswer} from "@/types/lesson.ts";
import lessonService from "@/services/database/lesson.ts";
import LessonService from "@/services/database/lesson.ts";
import {DatabaseError} from "@/errors/custom.ts";
import {useAuthStore} from "@/stores/auth.ts";
import profileService from "@/services/database/profile.ts";
import { toRaw } from "vue";

interface LessonState {
    examples: Lesson[],
    lessons: Lesson[];
    currentLesson: Lesson | null;
    currentQuestions: any;
    lessonModules: LessonModuleEntry[];
    openLessons: number;
}

export interface LessonModuleEntry {
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
        lessonModules: [],
        openLessons: 0
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
        getLessonModuleFieldValues: (state: any) => (componentId: string, field: string) => {
            const component = state.lessonModules.find((comp: any) => comp.uuid === componentId);
            return component ? component.data[field] : null;
        },
        getLessonModules: (state) => {
            return state.lessonModules;
        },
        getAmountOfFinishedLessons: (state) => {
            const finishedLessons = state.lessons.filter(l => l.isFinished === true);
            return finishedLessons.length;
        },
    },

    actions: {
        async fetchQuestionsForLesson(lessonUUID: string) {
            const questions = await lessonService.pull.fetchQuestionsForLesson(lessonUUID);
            if (Array.isArray(questions)) {
                this.currentQuestions = questions;
                this.setUpLessonModules();
            }
        },

        async fetchLessons() {
            const lessons = await lessonService.pull.fetchLessons();
            this.lessons = [];
            this.examples = [];

            if (lessons) {
                const enrichedLessons = [];

                for (const lesson of lessons) {
                    const creatorUsername = await profileService.pull.getUsername(lesson.user_id) || {username: 'Unbekannt'};
                    const creatorAvatar = await profileService.pull.getAvatar(lesson.user_id) || {avatar: 'fhdo'};

                    enrichedLessons.push({
                        lessonDTO: lesson,
                        isFinished: false,
                        isStarted: false,
                        hasSavedProgress: false,
                        userScore: 0,
                        creatorUsername: creatorUsername.username,
                        creatorAvatar: creatorAvatar.avatar
                    });
                }

                this.lessons = enrichedLessons;
            }


            const exampleLessons = await lessonService.pull.fetchLessons(true);

            if (exampleLessons) {
                this.examples = exampleLessons.map((l) => ({
                    lessonDTO: l,
                    isFinished: false,
                    isStarted: false,
                    hasSavedProgress: false,
                    userScore: 0
                }));
            }
            await this.initLessons(this.lessons);
            await this.initLessons(this.examples);
            let finishedLessons = this.getAmountOfFinishedLessons;
            this.openLessons = this.lessons.length - finishedLessons;
        },

        async initLessons(lessons: Lesson[]) {
            for (const l of lessons) {
                const status = await this.getStatusOfLessonForUser(l.lessonDTO.uuid);
                l.isFinished = status && (status.finished !== null) ? status.finished : false;
                l.isStarted = status && (status.is_started !== null) ? status.is_started : true;
                await this.loadFirstUserScoreForLesson(l.lessonDTO.uuid);
                if (l.isStarted) {
                    l.hasSavedProgress = await this.checkIfLessonHasProgress(l.lessonDTO.uuid);
                }
            }
        },

        async deleteLesson(lessonUUID: string) {
            await lessonService.push.deleteLesson(lessonUUID).then(
                (data: LessonDTO[] | undefined) => {
                    if (data) {
                        if (data.length > 0) {
                            this.lessons.splice(this.lessons.findIndex(c => c.lessonDTO.uuid === lessonUUID), 1);
                            return;
                        }
                    }
                    throw new DatabaseError("Lektion konnte nicht gelöscht werden.", 500);
                }
            );
        },

        loadLessonByUUID(lessonUUID: string) {
            this.clearLessonModules();
            const lesson = this.findLesson(lessonUUID);
            if (lesson) {
                this.currentLesson = lesson;
            }
        },

        addLessonModuleWithData(componentName: string, componentUUID: string, data: {
            uuid: string,
            question: any,
            options: any,
            solution: any,
            hint: any,
            points: any
        }) {
            this.lessonModules.push({
                type: componentName,
                uuid: componentUUID,
                data: data
            });
        },

        setLessonModuleData(componentId: string, field: string, value: any) {
            const component = this.lessonModules.find(comp => comp.uuid === componentId);
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

        async loadQuestionsWithSolutionsForLesson(lessonUUID: string) {
            const authStore = useAuthStore();
            let lesson = this.findLesson(lessonUUID);
            if (authStore.isTeacher || (lesson?.isFinished && !lesson.isStarted)) {
                const data = await lessonService.pull.fetchQuestionsWithSolutionsForLesson(lessonUUID);

                if (data) {
                    this.currentQuestions = data;
                    this.setUpLessonModules();
                    data.forEach(d => {
                        let component = this.lessonModules.find(component => component.data.uuid === d.uuid);
                        if (component) {
                            component.data.solution = d.solution;
                        }
                    })
                }
            }
        },

        filterComponentsByQuestionOnly() {
            return this.lessonModules.filter(c =>
                c.type === 'MultipleChoice' ||
                c.type === 'TrueOrFalse' ||
                c.type === 'Slider' ||
                c.type === 'Requirement')
        },

        clearLessonModules() {
            this.lessonModules = [];
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
                    if (points) {
                        lesson.userScore = Math.round(points);
                    } else {
                        lesson.userScore = -1;
                    }
                }
            }
        },

        async checkIfLessonHasProgress(lessonUUID: string) {
            const authStore = useAuthStore();
            if (authStore.user && !authStore.isTeacher) {
                return await LessonService.pull.checkIfLessonHasSavedProgress(lessonUUID, authStore.user.id);
            }
            return false;
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

            this.clearLessonModules();
        },

        async restartLessonProgressForUser(lessonUUID: string) {
            const authStore = useAuthStore();
            const lesson = this.findLesson(lessonUUID);
            if (authStore.user && lesson && lesson.hasSavedProgress) {
                await lessonService.push.deleteLessonProgressForUser(lessonUUID, authStore.user.id);
                if (lesson) lesson.hasSavedProgress = false;
            }

            this.clearLessonModules();
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

        setUpLessonModules() {
            this.clearLessonModules();

            if (this.currentQuestions.length > 0) {
                const sortedQuestions = this.getSortedCurrentQuestions;
                sortedQuestions.forEach(q => {
                    this.addLessonModuleWithData(q.question_type, q.uuid, {
                        uuid: q.uuid,
                        question: q.question,
                        options: q.options,
                        solution: q.solution,
                        hint: q.hint,
                        points: q.points
                    })
                })
            }
        },

        hydrateUserAnswers(answers: UserAnswer[]) {
            answers.forEach(answer => {
                const comp =
                    this.lessonModules.find(c => c.uuid === answer.question_id);
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
        },

        async uploadUsedHintForQuestion(questionUUID: string) {
            const authStore = useAuthStore();
            if (!authStore.isTeacher && authStore.user && this.currentLesson?.isStarted) {
                await LessonService.push.uploadUsedHintForQuestion(authStore.user.id, questionUUID, this.currentLesson.lessonDTO.uuid);
            }
        },

        async checkIfLessonTitleExists(lessonTitle: string, lessonUUID: string) {
            return await LessonService.pull.checkIfLessonTitleExists(lessonTitle, lessonUUID);
        }

    },
});
