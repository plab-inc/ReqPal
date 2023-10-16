import {supabase} from "@/plugins/supabase";
import {Question} from "@/types/lesson.types.ts";

class LessonServiceClass {

    public push = {
        uploadLesson: this.uploadLesson.bind(this),
    };

    public pull = {
        fetchLessons: this.fetchLessons,
        fetchLessonById: this.fetchLessonById.bind(this),
        fetchQuestionsForLesson: this.fetchQuestionsForLesson.bind(this),
    }

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

    private async uploadLesson(lessonJson: any){
        const { error } = await supabase
            .rpc('create_lesson_from_json', {
                data: lessonJson
            })

        if (error) console.error(error)
    }

}

const LessonService = new LessonServiceClass();

export default LessonService;