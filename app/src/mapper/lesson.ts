import {ObjectiveDTO} from "@/types/objective.ts";
import {Lesson, LessonDTO} from "@/types/lesson.ts";

export const mapToLesson = (input: any): Lesson => {
    const objectives: ObjectiveDTO[] = [];

    input.lesson_objectives.forEach((lessonObjective: any) => {
        objectives.push(lessonObjective.objectives);
    });

    const lessonDto: LessonDTO = {
        description: input.description,
        title: input.title,
        points: input.points,
        created_at: input.created_at,
        uuid: input.uuid,
        user_id: input.user_id,
        example: input.example
    }

    return {
        lessonDTO: lessonDto,
        objectives: objectives
    };
};