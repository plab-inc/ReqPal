import { supabase } from "@/plugins/supabase";
import { Lesson, LessonDTO, LessonForm, LessonQuestions, Question } from "@/types/lesson.ts";
import { mapToLesson } from "@/mapper/lesson.ts";

class LessonServiceClass {

    public push = {
        uploadLesson: this.uploadLesson.bind(this),
        deleteLesson: this.deleteLesson.bind(this),
        togglePublished: this.togglePublished.bind(this),
    };

    public pull = {
        fetchLessonWithQuestions: this.fetchLessonWithQuestions.bind(this),
        fetchLessons: this.fetchLessons,
        fetchQuestionsForLesson: this.fetchQuestionsForLesson.bind(this),
        getLesson: this.getLesson.bind(this),
        fetchQuestionsWithSolutionsForLesson: this.fetchQuestionsWithSolutionsForLesson.bind(this),
        getCountOfStudentsForTeacher: this.getCountOfStudentsForTeacher.bind(this),
        checkIfLessonTitleExists: this.checkIfLessonTitleExists.bind(this)
    };

    private async fetchLessons(examples: boolean = false): Promise<Lesson[] | undefined> {

        const {data, error} = await supabase
            .from('lessons')
            .select(`
            *,
            lesson_objectives:lesson_objectives(objectives(*))
        `)
            .eq('example', examples);

        if (error) throw error;

        if (data) {
            let result: Lesson[] = [];
            data.forEach(d => {
                const mapped: Lesson = mapToLesson(d);
                result.push(mapped);
            });
            return result;
        }
    }

    private async fetchLessonWithQuestions(lessonUUID: string): Promise<LessonQuestions | undefined> {
        const { data, error } = await supabase
          .from("lessons")
          .select(`*,
              questions:questions(
                uuid,
                lesson_uuid,
                question,
                question_type,
                options,
                hint,
                position,
                points
              ),lesson_objectives:lesson_objectives(objectives(*))`)
          .eq("uuid", lessonUUID)
          .single();

        if (error) throw error;

        if (data && data.questions) {
            const lesson: Lesson = mapToLesson(data);
            const questions: Question[] = data.questions as Question[];

            return {
                lesson,
                questions
            };
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