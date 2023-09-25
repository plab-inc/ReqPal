import {supabase} from "@/plugins/supabase";
import {Answer, mcAnswer, Question, questionTypes, SortableAnswer} from "@/types/lesson.types.ts";
import {Json} from "@/types/supabase.types.ts";

class LessonServiceClass {

    public push = {
        uploadMCQuestionToDatabase: this.addMultipleChoiceQuestion.bind(this),
        uploadTFQuestionToDatabase: this.addTrueOrFalseQuestion.bind(this),
    };

    public pull = {
        fetchLessons: this.fetchLessons,
        fetchLessonById: this.fetchLessonById.bind(this),
        fetchQuestionsForLesson: this.fetchQuestionsForLesson.bind(this),
        fetchMCAnswersForQuestion: this.fetchMCAnswersForQuestion.bind(this),
        fetchTFSolutionForQuestion: this.fetchTrueFalseSolutionForQuestion.bind(this),
        compareUserMCAnswers: this.compareUserMCAnswers.bind(this),
        compareUserSortableAnswers: this.compareUserSortableAnswers.bind(this)
    }

    private async fetchLessons() {

        const {data, error} = await supabase
            .from('lessons')
            .select('id, title, description')

        if (error) throw error;

        if (data) {
            return data;
        }
    }

    private async fetchLessonById(lessonId: number) {

        const {data, error} = await supabase
            .from('lessons')
            .select('id, title, description')
            .eq('id', lessonId)
            .single()

        if (error) throw error;

        if (data) {
            return data;
        }
    }

    private async fetchQuestionsForLesson(lessonId: number) {

        const {data, error} = await supabase
            .from('questions')
            .select('id, description, question_type')
            .eq('lesson_id', lessonId)

        if (error) throw error;

        if (data) {
            if (data) {
                const newQuestions: Question[] = data.map((questionData: any) => {
                    return {
                        id: questionData.id,
                        lessonId: lessonId,
                        description: questionData.description,
                        questionType: questionData.question_type,
                        userResults: null,
                    };
                });
                return newQuestions;
            }
        }
    }

    private async fetchMCAnswersForQuestion(questionId: number) {

        const {data, error} = await supabase
            .from('questions')
            .select('answers')
            .eq('id', questionId)

        if (error) throw error;

        let newAnswers: Answer[] = [];

        if (data) {
            data.forEach(answerData => {
                let answers = answerData.answers;
                if (Array.isArray(answers)) {
                    answers.forEach(answer => {
                        const typedAnswer = answer as { id: number; description: string } | undefined;
                        if (typedAnswer?.id && typedAnswer?.description) {
                            newAnswers.push({
                                id: typedAnswer.id,
                                description: typedAnswer.description
                            })
                        }
                    });
                }
            })
        }

        return newAnswers;
    }

    private async fetchTrueFalseSolutionForQuestion(questionId: number) {

        const {data, error} = await supabase
            .from('questions')
            .select('answers')
            .eq('id', questionId)
            .single()

        if (error) throw error;

        if (data) {
            const typedAnswer = data.answers as { solution: boolean } | undefined;
            if (typedAnswer) {
                return typedAnswer.solution;
            }
        }

        return null;
    }

    private async compareUserMCAnswers(userAnswers: Answer[], questionId: number) {

        const {data, error} = await supabase.rpc('mc_compare_solution', {
            answer_json: userAnswers,
            question_id: questionId,
        })

        if (error) throw error;

        if (data) {
            return data as {
                wholeAnswerIsCorrect: boolean;
                results: { id: number; answerIsCorrect: boolean; }[];
            } | null;
        }
    }

    private async compareUserSortableAnswers(userAnswers: SortableAnswer[], questionId: number) {
        const {data, error} = await supabase.rpc('sortable_compare_solution', {
            answer_json: userAnswers,
            question_id: questionId,
        })

        if (error) throw error;

        if (data) {
            return data as {
                wholeAnswerIsCorrect: boolean;
                results: { id: number; answerIsCorrect: boolean; }[];
            } | null;
        }
    }

    private async addTrueOrFalseQuestion(lessonId: number, questionText: string, solutionOfQuestion: boolean) {

        const {data, error} = await supabase
            .from('questions')
            .insert([
                {
                    description: questionText,
                    lesson_id: lessonId,
                    answers: {solution: solutionOfQuestion},
                    question_type: questionTypes.TrueOrFalse
                },
            ])
            .select()
            .single()

        if (error) throw error;

        if (data) {
            return data;
        }
    }

    private async addMultipleChoiceQuestion(lessonId: number, questionText: string, answers: mcAnswer[]) {

        if (answers.length <= 0) throw new Error("Answers cannot be 0");

        const {data, error} = await supabase
            .from('questions')
            .insert([
                {
                    description: questionText,
                    lesson_id: lessonId,
                    answers: answers,
                    question_type: questionTypes.MultipleChoice
                },
            ])
            .select()
            .single()

        if (error) throw error;

        if (data) {
            return data;
        }
    }

}

const LessonService = new LessonServiceClass();

export default LessonService;