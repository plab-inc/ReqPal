import {LevelDTO, ObjectiveLevel} from "@/types/level.ts";
import {Objective} from "@/types/objective.ts";

export const mapToObjectiveLevel = (input: any): ObjectiveLevel => {

    const levelDto: LevelDTO = {
        id: input.id,
        user_id: input.user_id,
        objective_id: input.objective_id,
        xp: input.xp,
        xp_threshold: input.xp_threshold,
        level: input.level,
        max: input.max,
        created_at: input.created_at,
    };

    const objective: Objective = {
        id: input.objective_id,
        name: input.objectives.name,
        description: input.objectives.description,
        max_level: input.objectives.max_level,
    };

    return {
        ...levelDto,
        objective: objective,
    };
};
