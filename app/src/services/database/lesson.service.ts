import {supabase} from "@/plugins/supabase";
import {Lesson, UserAnswer} from "@/types/lesson.types.ts";
import {Question} from "@/interfaces/Question.interfaces.ts";

class LessonServiceClass {

    public push = {
        uploadLesson: this.uploadLesson.bind(this),
        deleteLesson: this.deleteLesson.bind(this),
        togglePublished: this.togglePublished.bind(this),
        uploadUserAnswers: this.submitUserAnswers.bind(this)
    };

    public pull = {
        fetchLessons: this.fetchLessons,
        fetchLessonById: this.fetchLessonById.bind(this),
        fetchQuestionsForLesson: this.fetchQuestionsForLesson.bind(this),
        getLesson: this.getLesson.bind(this),
        fetchQuestionsWithSolutionsForLesson: this.fetchQuestionsWithSolutionsForLesson.bind(this),
        fetchLessonFinishedForUser: this.fetchLessonFinishedForUser.bind(this),
        fetchLessonUserAnswers: this.fetchLessonUserAnswers.bind(this)
    };

    private async fetchLessons(examples: boolean = false) {

        const {data, error} = await supabase
            .from('lessons')
            .select('*')
            .eq('example', examples)

        if (error) throw error;

        if (data) {
            return data;
        }
    }

    private async fetchLessonById(lessonUUID: string) {

        const {data, error} = await supabase
            .from('lessons')
            .select('*')
            .eq('uuid', lessonUUID)
            .single()

        if (error) throw error;

        if (data) {
            return data;
        }
    }

    private async fetchQuestionsForLesson(lessonUUID: string) {

        const {data, error} = await supabase
            .from('questions')
            .select('uuid,lesson_uuid,question,question_type,options,hint,position')
            .eq('lesson_uuid', lessonUUID)

        if (error) throw error;

        if (data) {
            return data as Question[];
        }

    }

    private async uploadLesson(lesson: Lesson) {
        const {error} = await supabase
            .rpc('create_lesson_from_json', {
                data: lesson
            })

        if (error) console.error(error)
    }

    private async getLesson(lessonUUID: string) {
        const {error, data} = await supabase
            .rpc('get_lesson_json', {
                p_lesson_uuid: lessonUUID
            })

        if (error) console.error(error)

        if (data) return data as Lesson;
    }

    private async deleteLesson(lessonUUID: string) {
        const {data, error} = await supabase
            .from('lessons')
            .delete()
            .eq('uuid', lessonUUID)
            .select();

        if (error) throw error;

        return data;
    }

    private async togglePublished(lessonUUID: string) {
        const {error} = await supabase
            .rpc('reverse_boolean_value', {
                row_uuid: lessonUUID
            })

        if (error) console.error(error)
    }


    private async submitUserAnswers(answers: any) {

        const {data, error} = await supabase.rpc('create_user_answers_from_json', {
            data: answers
        })

        if (error) throw error;

        return data;

    }

    private async fetchQuestionsWithSolutionsForLesson(lessonUUID: string) {

        const {data, error} = await supabase
            .from('questions')
            .select('uuid,lesson_uuid,question,question_type,options,hint,position, solution')
            .eq('lesson_uuid', lessonUUID)

        if (error) throw error;

        if (data) {
            return data as Question[];
        }
    }

    private async fetchLessonFinishedForUser(lessonUUID: string, userUUID: string) {
        const {data, error} = await supabase
            .from('user_finished_lessons')
            .select('finished')
            .eq('lesson_id', lessonUUID)
            .eq('user_id', userUUID)

        if (error) {
            throw error;
        }

        if (data?.length > 0) {
            return data[0];
        } else {
            return null;
        }
    }

    private async fetchLessonUserAnswers(lessonUUID: string, userUUID: string) {
        const {data, error} = await supabase
            .from('user_answers')
            .select('question_id, answer')
            .eq('lesson_id', lessonUUID)
            .eq('user_id', userUUID)

        if (error) throw error;

        if (data) {
            return data as UserAnswer[];
        } else return null;

    }

}

const LessonService = new LessonServiceClass();

export default LessonService;