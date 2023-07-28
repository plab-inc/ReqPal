import {defineStore} from 'pinia';
import {supabase} from "@/plugins/supabase";
import {compareUserAnswers} from "@/services/lesson.service";

export interface Answer {
    id: string,
    description: string;
    solution: boolean;
}

export interface Question {
    id: number;
    lessonId: string;
    type: string;
    description: string;
    answers: Answer[];
    userResults: Result | null;
}

export interface Result {
    wholeAnswerIsCorrect: boolean;
    results: answerResults[];
}

export interface answerResults {
    id: string,
    answerIsCorrect: boolean;
}

interface Lesson {
    id: number;
    title: string;
    description: string;
}

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
    },

    actions: {
        init() {
            this.fetchLessons();
        },

        async fetchLessons() {
            console.log("Checking to fetch lessons")
            if (this.lessonsLoaded) return;

            console.log("Fetching lessons...")
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

        async fetchLessonById(lessonId: number) {
            console.log("Fetching single lessons")

            const lessonJson = localStorage.getItem('lesson');
            if (lessonJson) {
                console.log("Used local storage")
                this.currentLesson = JSON.parse(lessonJson);
                if (this.currentLesson?.id == lessonId) return;
            }

            const {data, error} = await supabase
                .from('lessons')
                .select('id, title, description')
                .eq('id', lessonId)
                .single()

            if (error) throw error;

            if (data) {
                this.currentLesson = data;
                localStorage.setItem('lesson', JSON.stringify(data));
            }
        },

        async fetchQuestionsForLesson(lessonId: string) {
            console.log("Fetching questions for lesson")

            const questionsJson = localStorage.getItem('questions');
            if (questionsJson) {
                console.log("Used local storage")
                this.currentQuestions = JSON.parse(questionsJson);
                const result = this.currentQuestions?.every(question => {
                    return question.lessonId === lessonId;
                });

                if (result === true) {
                    return;
                }
            }

            const {data, error} = await supabase
                .from('questions')
                .select('id, description, type, answers')
                .eq('lesson_id', lessonId)

            if (error) throw error;

            if (data) {

                this.currentQuestions = data.map((questionData: any) => {
                    return {
                        id: questionData.id,
                        lessonId: lessonId,
                        type: questionData.type,
                        description: questionData.description,
                        answers: questionData.answers,
                        userResults: null,
                    };
                });
                localStorage.setItem('questions', JSON.stringify(this.currentQuestions));
            }
        },

        async compareUserAnswers(userAnswerJson: Answer[], questionId: number) {
            const data = await compareUserAnswers(userAnswerJson, questionId);
            if (data) {
                const question = this.currentQuestions.find((q) => q.id === questionId);
                if (question) {
                    question.userResults = data;
                }
            }
        }
    },
});
