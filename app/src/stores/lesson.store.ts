import {defineStore} from 'pinia';
import {supabase} from "@/plugins/supabase";
import {Answer, Lesson, Question} from "@/types/lesson.types";

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

            const lessonJson = localStorage.getItem('lesson');
            if (lessonJson) {
                const tempLesson: Lesson = JSON.parse(lessonJson);
                if (tempLesson.id.toString() === lessonId) {
                    this.currentLesson = tempLesson;
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
                localStorage.setItem('lesson', JSON.stringify(data));
            }
        },

        async fetchQuestionsForLesson(lessonId: string) {
            this.currentQuestions = [];

            const questionsJson = localStorage.getItem('questions');
            if (questionsJson) {
                const tempQuestions: Question[] = JSON.parse(questionsJson);

                if (tempQuestions.length > 0) {
                    const result = tempQuestions?.every(question => {
                        return question.lessonId === lessonId;
                    });
                    if (result === true) {
                        this.currentQuestions = tempQuestions;
                        return;
                    }
                }
            }

            const {data, error} = await supabase
                .from('questions')
                .select('id, description, type')
                .eq('lesson_id', lessonId)

            if (error) throw error;

            if (data) {
                this.currentQuestions = data.map((questionData: any) => {
                    return {
                        id: questionData.id,
                        lessonId: lessonId,
                        type: questionData.type,
                        description: questionData.description,
                        userResults: null,
                    };
                });
                localStorage.setItem('questions', JSON.stringify(this.currentQuestions));
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
