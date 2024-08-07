import { defineStore } from "pinia";
import { Lesson, LessonDTO, Question, QuestionAnswer } from "@/types/lesson.ts";
import lessonService from "@/services/database/lesson.ts";
import LessonService from "@/services/database/lesson.ts";
import { DatabaseError } from "@/errors/custom.ts";
import { useAuthStore } from "@/stores/auth.ts";
import profileService from "@/services/database/profile.ts";
import { VForm } from "vuetify/components";
import { toRaw } from "vue";
import { ObjectiveDTO } from "@/types/objective.ts";

interface LessonState {
    examples: Lesson[],
    lessons: Lesson[];
    currentLesson: Lesson | null;
    currentQuestions: any;
    lessonModules: LessonModuleEntry[];
    lessonForm: VForm | null;
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
        lessonForm: null
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
        getLessonObjectives: (state: any) => (lessonId: string) => {
            return state.lessons.find((lesson: Lesson) => lesson.lessonDTO.uuid === lessonId)?.objectives.map((objective: ObjectiveDTO) => objective.name) || [];
        }
    },

    actions: {
        async isLessonFormValid() {
            if (!this.lessonForm) {
                return false;
            }

            return (await this.lessonForm?.validate().then(value => {
                return value.valid;
            }));
        },
        async generateQuestionAnswers(): Promise<QuestionAnswer[] | null> {
            const questions = this.filterComponentsByQuestionOnly();
            if (this.currentLesson) {
                return questions.map(component => {
                    return {
                        questionId: component.uuid,
                        options: toRaw(component.data.options),
                        type: component.type
                    };
                });
            }
            return null;
        },
        async loadInUserAnswers(answers: QuestionAnswer[]) {
            answers.forEach(answer => {
                const comp = this.lessonModules.find(c => c.uuid === answer.questionId);
                if (comp) comp.data.options = answer.options;
            });
        },
        filterComponentsByQuestionOnly() {
            return this.lessonModules.filter(c =>
                c.type === "MultipleChoice" ||
                c.type === "TrueOrFalse" ||
                c.type === "Slider" ||
                c.type === "Requirement");
        },
        async fetchLessonWithQuestions(lessonUUID: string) {
            const lessonWithQuestions = await lessonService.pull.fetchLessonWithQuestions(lessonUUID);
            if (lessonWithQuestions) {
                this.currentQuestions = lessonWithQuestions.questions;
                this.currentLesson = lessonWithQuestions.lesson;
                this.setUpLessonModules();
            }
        },

        async fetchLessonsWithQuestions(lessonUUIDs: string[]) {
            const lessonWithQuestions = await lessonService.pull.fetchLessonsWithQuestions(lessonUUIDs);
            if (lessonWithQuestions) {
                return lessonWithQuestions;
            }
        },

        async fetchLessons() {
            const lessons = await lessonService.pull.fetchLessons();
            const exampleLessons = await lessonService.pull.fetchLessons(true);

            if (lessons) {
                for (const lesson of lessons) {
                    const creatorUsername = await profileService.pull.getUsername(lesson.lessonDTO.user_id) || {username: 'Unbekannt'};
                    const creatorAvatar = await profileService.pull.getAvatar(lesson.lessonDTO.user_id) || {avatar: 'fhdo'};

                    lesson.creatorAvatar = creatorAvatar.avatar;
                    lesson.creatorUsername = creatorUsername.username;
                }
            }

            this.lessons = lessons ? lessons : [];
            this.examples = exampleLessons ? exampleLessons : [];
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

        async loadQuestionsWithSolutionsForLesson(lessonUUID: string) {
            const authStore = useAuthStore();
            if (authStore.isTeacher) {
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

        clearLessonModules() {
            this.lessonModules = [];
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

        findLesson(lessonUUID: string) {
            let lesson = this.lessons.find(l => l.lessonDTO.uuid === lessonUUID);
            if (!lesson) {
                lesson = this.examples.find(l => l.lessonDTO.uuid === lessonUUID);
            }
            return lesson;
        },

        async checkIfLessonTitleExists(lessonTitle: string, lessonUUID: string) {
            return await LessonService.pull.checkIfLessonTitleExists(lessonTitle, lessonUUID);
        },

    },
});
