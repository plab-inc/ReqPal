import {supabase} from "@/plugins/supabase";
import {Lesson, QuestionDTO} from "@/types/lesson.types.ts";

class LessonServiceClass {

    public push = {
        uploadLesson: this.uploadLesson.bind(this),
    };

    public pull = {
        fetchLessons: this.fetchLessons,
        fetchLessonById: this.fetchLessonById.bind(this),
        fetchQuestionsForLesson: this.fetchQuestionsForLesson.bind(this),
        getLesson: this.getLesson.bind(this),
    };

    private async fetchLessons() {

        const {data, error} = await supabase
            .from('lessons')
            .select('*')

        if (error) throw error;

        if (data) {
            return data;
        }
    }

    private async fetchLessonById(lessonId: number) {

        const {data, error} = await supabase
            .from('lessons')
            .select('*')
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
            .select('id,lesson_id,question,question_type,options,hint,position')
            .eq('lesson_id', lessonId)

        if (error) throw error;

            if (data) {
                const newQuestions: QuestionDTO[] = data.map((questionData: any) => {
                    return {
                        id: questionData.id,
                        hint: questionData.hint,
                        options: questionData.options,
                        lesson_id: lessonId,
                        question: questionData.question,
                        question_type: questionData.question_type,
                        solution: null,
                        position: questionData.position,
                    };
                });
                return newQuestions;
            }

    }

    private async uploadLesson(lesson: Lesson){
        const { error } = await supabase
            .rpc('create_lesson_from_json', {
                data: lesson
            })

        if (error) console.error(error)
    }
    private async getLesson(lessonId: number) {
        const { error, data } = await supabase
            .rpc('get_lesson_json', {
                p_lesson_id: lessonId
            })

        if (error) console.error(error)

        if (data) return data as Lesson;
    }

}

const LessonService = new LessonServiceClass();

export default LessonService;