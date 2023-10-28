import {supabase} from "@/plugins/supabase";
import {LessonForm, LessonStatistic, UserAnswer, UserResult} from "@/types/lesson.types.ts";
import {Question} from "@/interfaces/Question.interfaces.ts";

class LessonServiceClass {

    public push = {
        uploadLesson: this.uploadLesson.bind(this),
        deleteLesson: this.deleteLesson.bind(this),
        togglePublished: this.togglePublished.bind(this),
        uploadUserAnswers: this.submitUserAnswers.bind(this),
        setLessonStartedStatus: this.setLessonStartedStatus.bind(this)
    };

    public pull = {
        fetchLessons: this.fetchLessons,
        fetchLessonById: this.fetchLessonById.bind(this),
        fetchQuestionsForLesson: this.fetchQuestionsForLesson.bind(this),
        getLesson: this.getLesson.bind(this),
        fetchQuestionsWithSolutionsForLesson: this.fetchQuestionsWithSolutionsForLesson.bind(this),
        fetchLessonStatusForUser: this.fetchLessonStatusForUser.bind(this),
        fetchLessonUserAnswers: this.fetchLessonUserAnswers.bind(this),
        fetchUserScoreForLesson: this.fetchUserScoreForLesson.bind(this),
        fetchFirstUserScoreForLesson: this.fetchFirstUserScoreForLesson.bind(this),
        checkLessonFinishedForFirstTime: this.checkLessonFinishedForFirstTime.bind(this),
        fetchLessonStatistics: this.fetchLessonStatistics.bind(this),
        getCountOfStudentsForTeacher: this.getCountOfStudentsForTeacher.bind(this)
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

    private async uploadLesson(lesson: LessonForm) {
        const {error} = await supabase
            .rpc('create_lesson_from_json', {
                data: lesson
            })

        if (error) throw error;
    }

    private async getLesson(lessonUUID: string) {
        const {error, data} = await supabase
            .rpc('get_lesson_json', {
                p_lesson_uuid: lessonUUID
            })

        if (error) console.error(error)

        if (data) return data as LessonForm;
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

    private async fetchLessonStatusForUser(lessonUUID: string, userUUID: string) {
        const {data, error} = await supabase
            .from('user_finished_lessons')
            .select('finished, is_started')
            .eq('lesson_id', lessonUUID)
            .eq('user_id', userUUID)

        if (error) {
            throw error;
        }

        if (data) {
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

    private async fetchUserScoreForLesson(lessonUUID: string, userUUID: string) {
        const {data, error} = await supabase
            .from('user_answers')
            .select('result')
            .eq('lesson_id', lessonUUID)
            .eq('user_id', userUUID)

        if (error) throw error;

        if (data) {
            return data as UserResult[];
        } else return null;
    }

    private async checkLessonFinishedForFirstTime(lessonUUID: string, userUUID: string) {
        const {data, error} = await supabase
            .from('user_finished_lessons')
            .select('finished_for_first_time')
            .eq('lesson_id', lessonUUID)
            .eq('user_id', userUUID)

        if (error) throw error;

        if (data && data[0]) {
            return data[0].finished_for_first_time;
        } else return null;
    }

    private async fetchFirstUserScoreForLesson(lessonUUID: string, userUUID: string) {
        const {data, error} = await supabase
            .from('user_finished_lessons')
            .select('user_points')
            .eq('lesson_id', lessonUUID)
            .eq('user_id', userUUID)

        if (error) throw error;

        if (data && data[0]) {
            return data[0].user_points;
        } else return null;
    }

    private async setLessonStartedStatus(lessonUUID: string, userUUID: string, status: boolean) {
        const {data, error} = await supabase
            .from('user_finished_lessons')
            .update({is_started: status})
            .eq('lesson_id', lessonUUID)
            .eq('user_id', userUUID)
            .select()
            .single()

        if (error) throw error;

        if (data && data.is_started !== null) {
            return data.is_started;
        }
        return false;

    }

    private async fetchLessonStatistics(lessonUUID: string) {
        const {data, error} = await supabase
            .from('user_finished_lessons')
            .select('finished, user_points')
            .eq('lesson_id', lessonUUID)

        if (error) throw error;

        if (data) {
            return data as LessonStatistic[];
        }
        return null;

    }

    private async getCountOfStudentsForTeacher(teacherUUID: string) {
        const {data, error} = await supabase
            .from('profiles')
            .select('teacher')
            .eq('teacher', teacherUUID)

        if (error) throw error;

        if (data && data.length > 10) {
            return data.length;
        }
        return 0;
    }

}

const LessonService = new LessonServiceClass();

export default LessonService;