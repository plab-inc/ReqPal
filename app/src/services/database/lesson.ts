import {supabase} from "@/plugins/supabase";
import {
    LessonDTO,
    LessonForm,
    LessonStatistic,
    Question
} from "@/types/lesson.ts";

class LessonServiceClass {

    public push = {
        uploadLesson: this.uploadLesson.bind(this),
        deleteLesson: this.deleteLesson.bind(this),
        togglePublished: this.togglePublished.bind(this),
        uploadUsedHintForQuestion: this.uploadUsedHintForQuestion.bind(this),
    };

    public pull = {
        fetchLessons: this.fetchLessons,
        fetchQuestionsForLesson: this.fetchQuestionsForLesson.bind(this),
        getLesson: this.getLesson.bind(this),
        fetchQuestionsWithSolutionsForLesson: this.fetchQuestionsWithSolutionsForLesson.bind(this),
        fetchLessonStatistics: this.fetchLessonStatistics.bind(this),
        getCountOfStudentsForTeacher: this.getCountOfStudentsForTeacher.bind(this),
        checkIfLessonTitleExists: this.checkIfLessonTitleExists.bind(this)
    };

    private async fetchLessons(examples: boolean = false): Promise<LessonDTO[] | undefined> {

        const {data, error} = await supabase
            .from('lessons')
            .select('*')
            .eq('example', examples)

        if (error) throw error;

        if (data) {
            return data;
        }
    }

    private async fetchQuestionsForLesson(lessonUUID: string): Promise<Question[] | undefined> {

        const {data, error} = await supabase
            .from('questions')
            .select('uuid,lesson_uuid,question,question_type,options,hint,position,points')
            .eq('lesson_uuid', lessonUUID)

        if (error) throw error;

        if (data) {
            return data as Question[];
        }

    }

    private async uploadLesson(lesson: LessonForm): Promise<void> {
        const {error} = await supabase
            .rpc('create_lesson_from_json', {
                data: lesson
            })

        if (error) throw error;
    }

    private async getLesson(lessonUUID: string): Promise<LessonForm | undefined> {
        const {error, data} = await supabase
            .rpc('get_lesson_json', {
                p_lesson_uuid: lessonUUID
            })

        if (error) console.error(error)

        if (data) return data as LessonForm;
    }

    private async deleteLesson(lessonUUID: string): Promise<LessonDTO[] | undefined> {
        const {data, error} = await supabase
            .from('lessons')
            .delete()
            .eq('uuid', lessonUUID)
            .select();

        if (error) throw error;

        return data as LessonDTO[];
    }

    private async togglePublished(lessonUUID: string): Promise<void> {
        const {error} = await supabase
            .rpc('reverse_boolean_value', {
                table_name: 'lessons',
                boolean_column_name: 'published',
                id_column_name: 'uuid',
                row_id: lessonUUID
            })

        if (error) console.error(error)
    }

    private async fetchQuestionsWithSolutionsForLesson(lessonUUID: string): Promise<Question[] | undefined> {

        const {data, error} = await supabase
            .from('questions')
            .select('uuid,lesson_uuid,question,question_type,options,hint,position,solution,points')
            .eq('lesson_uuid', lessonUUID)

        if (error) throw error;

        if (data) {
            return data as Question[];
        }
    }

    private async fetchLessonStatistics(lessonUUID: string): Promise<LessonStatistic[] | undefined> {
        const {data, error} = await supabase
            .from('user_finished_lessons')
            .select('finished, user_points')
            .eq('lesson_id', lessonUUID)

        if (error) throw error;

        if (data) {
            return data as LessonStatistic[];
        }
    }

    private async getCountOfStudentsForTeacher(teacherUUID: string): Promise<number> {
        const {error, count} = await supabase
            .from('profiles')
            .select('teacher', {count: 'exact', head: true})
            .eq('teacher', teacherUUID)

        if (error) throw error;

        if (count) {
            return count;
        }
        return 0;
    }

    private async uploadUsedHintForQuestion(userUUID: string, questionUUID: string, lessonUUID: string): Promise<void> {
        const {data, error} = await supabase
            .from('user_hints')
            .select('*')
            .eq('question_id', questionUUID)
            .eq('user_id', userUUID)
            .eq('lesson_id', lessonUUID)

        if (error) throw error;
        if (!data || data.length <= 0) {
            const {error} = await supabase
                .from('user_hints')
                .insert([
                    {
                        question_id: questionUUID,
                        user_id: userUUID,
                        lesson_id: lessonUUID
                    },
                ])
            if (error) throw error;
        }
    }

    private async checkIfLessonTitleExists(lessonTitle: string, lessonUUID: string): Promise<boolean | undefined> {
        const {error, count} = await supabase
            .from('lessons')
            .select('title', {count: 'exact', head: true})
            .eq('title', lessonTitle)
            .not('uuid', 'eq', lessonUUID);

        if (error) throw error;

        if (count) {
            return count > 0;
        }
    }
}

const LessonService: LessonServiceClass = new LessonServiceClass();

export default LessonService;