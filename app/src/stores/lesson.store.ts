import {defineStore} from 'pinia';
import {Answer, Lesson, mcAnswer, Question, questionTypes, SortableAnswer} from "@/types/lesson.types";
import lessonService from "@/services/database/lesson.service.ts";

interface LessonState {
    lessons: Lesson[];
    currentLesson: Lesson | null;
    currentQuestions: Question[];
    lessonsLoaded: Boolean;
}

export const useLessonStore = defineStore('lesson', {
    state: (): LessonState => ({
        lessons: [],
        currentLesson: null,
        currentQuestions: [],
        lessonsLoaded: false,
    }),

    getters: {
        getAllLessons: state => {
            return state.lessons;
        },

        getLessonById: (state) => {
            return state.currentLesson;
        },

        getAllQuestions: state => {
            return state.currentQuestions;
        },

        getMultipleChoiceQuestions: state => {
            return state.currentQuestions.filter(question => question.questionType === questionTypes.MultipleChoice);
        },

        getTrueOrFalseQuestions: state => {
            return state.currentQuestions.filter(question => question.questionType === questionTypes.TrueOrFalse);
        },

        getDragAndDropQuestions: state => {
            return state.currentQuestions.filter(question => question.questionType === questionTypes.DragAndDrop);
        },
        getSortableQuestions: state => {
            return state.currentQuestions.filter(question => question.questionType === questionTypes.Sortable);
        },
    },

    actions: {
        addCurrentQuestion(id: number, lessonId: number, description: string, questionType: questionTypes) {
            this.currentQuestions.push({
                id: id,
                lessonId: lessonId,
                description: description,
                questionType: questionType,
                userResults: null
            })
        },

        async fetchQuestionsForLesson(lessonId: number) {
            const questions = await lessonService.pull.fetchQuestionsForLesson(lessonId);
            if (questions) {
                this.currentQuestions = questions;
            }
        },

        async fetchMCAnswersForQuestion(questionId: number) {
            return await lessonService.pull.fetchMCAnswersForQuestion(questionId);
        },

        async fetchTrueFalseSolutionForQuestion(questionId: number) {
            return await lessonService.pull.fetchTFSolutionForQuestion(questionId);
        },


        async compareUserMCAnswers(userAnswers: Answer[], questionId: number) {

            const results = await lessonService.pull.compareUserMCAnswers(userAnswers, questionId);
            if (results) {
                const question = this.currentQuestions.find((q) => q.id === questionId);
                if (question) {
                    question.userResults = results;
                }
            }
        },

        async compareUserSortableAnswers(userAnswers: SortableAnswer[], questionId: number) {
            const results = await lessonService.pull.compareUserSortableAnswers(userAnswers, questionId);
            if (results) {
                const question = this.currentQuestions.find((q) => q.id === questionId);
                if (question) {
                    question.userResults = results;
                }
            }
        },

        async addTrueOrFalseQuestion(lessonId: number, questionText: string, solutionOfQuestion: boolean) {

            const newQuestion = await lessonService.push.uploadTFQuestionToDatabase(lessonId, questionText, solutionOfQuestion);

            if (newQuestion) {
                if (this.currentLesson?.id === lessonId) {
                    if (newQuestion.lesson_id && newQuestion.description) {
                        this.addCurrentQuestion(newQuestion.id, newQuestion.lesson_id, newQuestion.description, questionTypes.TrueOrFalse);
                    }
                }
            }
        },

        async addMultipleChoiceQuestion(lessonId: number, questionText: string, answers: mcAnswer[]) {

            if (answers.length <= 0) throw new Error("Answers cannot be 0");

            const newQuestion = await lessonService.push.uploadMCQuestionToDatabase(lessonId, questionText, answers);

            if (newQuestion) {
                if (this.currentLesson?.id === lessonId) {
                    if (newQuestion.lesson_id && newQuestion.description) {
                        this.addCurrentQuestion(newQuestion.id, newQuestion.lesson_id, newQuestion.description, questionTypes.MultipleChoice);
                    }
                }
            }
        }
    },
});
