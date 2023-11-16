import {supabase} from "@/plugins/supabase";
import {LessonAnswer, LessonForm, LessonStatistic, Question, UserAnswer, UserResult} from "@/types/lesson.types.ts";

class LessonServiceClass {

    public push = {
        uploadLesson: this.uploadLesson.bind(this),
        deleteLesson: this.deleteLesson.bind(this),
        togglePublished: this.togglePublished.bind(this),
        uploadUserAnswers: this.submitUserAnswers.bind(this),
        setLessonStartedStatus: this.setLessonStartedStatus.bind(this),
        uploadUserProgressToLesson: this.uploadUserProgressToLesson.bind(this),
        uploadUsedHintForQuestion: this.uploadUsedHintForQuestion.bind(this),
        deleteLessonProgressForUser: this.deleteLessonProgressForUser.bind(this)
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
        fetchLessonStatistics: this.fetchLessonStatistics.bind(this),
        getCountOfStudentsForTeacher: this.getCountOfStudentsForTeacher.bind(this),
        fetchUserProgressForLesson: this.fetchUserProgressForLesson.bind(this),
        checkIfLessonHasSavedProgress: this.checkIfLessonHasSavedProgress.bind(this)
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
            .select('finished, is_started, finished_for_first_time')
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
        const {data, error, status, count} = await supabase
            .from('profiles')
            .select('teacher', {count: 'exact', head: true})
            .eq('teacher', teacherUUID)

        if (error) throw error;

        if (count) {
            return count;
        }
        return 0;
    }

    private async uploadUserProgressToLesson(userUUID: string, lessonAnswer: LessonAnswer) {
        const exists = await this.fetchUserProgressForLesson(userUUID, lessonAnswer.uuid);

        if (exists) {
            const {data, error} = await supabase
                .from('user_lesson_progress')
                .update({answers: lessonAnswer.answers})
                .eq('lesson_id', lessonAnswer.uuid)
                .eq('user_id', userUUID)

            if (error) throw error;
        } else {
            const {data, error} = await supabase
                .from('user_lesson_progress')
                .insert([
                    {
                        lesson_id: lessonAnswer.uuid,
                        user_id: userUUID,
                        answers: lessonAnswer.answers,
                    },
                ])
            if (error) throw error;
        }
    }

    private async fetchUserProgressForLesson(userUUID: string, lessonUUID: string) {
        const {data, error} = await supabase
            .from('user_lesson_progress')
            .select('answers')
            .eq('lesson_id', lessonUUID)
            .eq('user_id', userUUID)

        if (error) throw error;

        if (data && data.length > 0) {
            return data[0];
        }
        return null;
    }

    private async uploadUsedHintForQuestion(userUUID: string, questionUUID: string, lessonUUID: string) {
        const {data, error} = await supabase
            .from('user_hints')
            .select('*')
            .eq('question_id', questionUUID)
            .eq('user_id', userUUID)
            .eq('lesson_id', lessonUUID)

        if (error) throw error;
        if (!data || data.length <= 0) {
            const {data, error} = await supabase
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

    private async deleteLessonProgressForUser(lessonUUID: string, userUUID: string) {
        const {data, error} = await supabase
            .from('user_lesson_progress')
            .delete()
            .eq('lesson_id', lessonUUID)
            .eq('user_id', userUUID)

        if (error) throw error;

        return data;
    }

    private async checkIfLessonHasSavedProgress(lessonUUID: string, userUUID: string) {
        const {data, error, status, count} = await supabase
            .from('user_lesson_progress')
            .select('lesson_id, user_id', {count: 'exact', head: true})
            .eq('lesson_id', lessonUUID)
            .eq('user_id', userUUID)

        if (error) throw error;

        if(count) return count > 0;
        return false;
    }
}

const LessonService = new LessonServiceClass();

export default LessonService;