import {defineStore} from 'pinia';
import {supabase} from "@/plugins/supabase";
import {Answer, Lesson, Question, questionTypes} from "@/types/lesson.types";
import {useStorage} from "@vueuse/core";

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
    },

    actions: {
        init() {
            this.fetchLessons();
        },

        async fetchLessons() {
            if (this.lessonsLoaded) return;

            const {data, error} = await supabase
                .from('lessons')
                .select('id, title, description')

            if (error) throw error;

            if (data) {
                this.lessons = data.map((lessonData: any) => {

                    return {
                        id: lessonData.id,
                        title: lessonData.title,
                        description: lessonData.description
                    };
                });
            }
            this.lessonsLoaded = true;
        },

        async fetchLessonById(lessonId: string) {

            const lessonFromLocalStorage = useStorage('lesson', {id: '', title: '', description: ''});
            const lesson: Lesson = lessonFromLocalStorage.value;

            if (lesson) {
                if (lesson.id.toString() === lessonId) {
                    this.currentLesson = lesson;
                    return;
                }
            }

            const {data, error} = await supabase
                .from('lessons')
                .select('id, title, description')
                .eq('id', lessonId)
                .single()

            if (error) throw error;

            if (data) {
                this.currentLesson = data;
                lessonFromLocalStorage.value = data;
            }
        },

        async fetchQuestionsForLesson(lessonId: string) {
            this.currentQuestions = [];

            const questionsFromStorage = useStorage('questions',
                [{ id: '', lessonId: '', questionType: null, description: '', userResults: null}]);
            const questions: Question[] = questionsFromStorage.value;
            if (questions) {
                if (questions.length > 0) {
                    const result = questions?.every(question => {
                        return question.lessonId === lessonId;
                    });
                    if (result === true) {
                        this.currentQuestions = questions;
                        return;
                    }
                }
            }

            const {data, error} = await supabase
                .from('questions')
                .select('id, description, question_type')
                .eq('lesson_id', lessonId)

            if (error) throw error;

            if (data) {
                if (data) {
                    const newQuestions = data.map((questionData: any) => {

                        return {
                            id: questionData.id,
                            lessonId: lessonId,
                            description: questionData.description,
                            questionType: questionData.question_type,
                            userResults: null,
                        };
                    });

                    this.currentQuestions = newQuestions;
                    questionsFromStorage.value = newQuestions;
                }
            }
        },

        async fetchAnswersForQuestion(questionId: string) {

            const {data, error} = await supabase
                .from('questions')
                .select('answers')
                .eq('id', questionId)

            if (error) throw error;

            if (data) {
                const answersData = data.map((item: any) => item.answers);
                return answersData.flat();
            }

            return [];
        },

        async compareUserAnswers(userAnswerJson: Answer[], questionId: string) {

            const {data, error} = await supabase.rpc('mc_compare_solution', {
                answer_json: userAnswerJson,
                question_id: questionId,
            })

            if (error) {
                console.error(error)
            }

            if (data) {
                const question = this.currentQuestions.find((q) => q.id === questionId);
                if (question) {
                    question.userResults = data;
                }
            }
        }
    },
});
