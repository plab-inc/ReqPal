import {ReqPalAchievement, ReqPalAchievementLevelDTO} from "@/types/achievement.ts";

export const mapToReqPalAchievement = (input: any, levelsExist: boolean): ReqPalAchievement => {
    const reqPalAchievementLevels: ReqPalAchievementLevelDTO[] = [];

    if (levelsExist) {
        input.reqpal_achievement_levels.forEach((level: any) => {
            reqPalAchievementLevels.push(level);
        });
    }

    reqPalAchievementLevels.sort((a, b) => a.level - b.level);
    const image = reqPalAchievementLevels.length > 0 ? reqPalAchievementLevels[0].image : "";

    return {
        id: input.id,
        description: input.description,
        created_at: input.created_at,
        target_field: input.target_field,
        firstLevelImage: image,
        levels: reqPalAchievementLevels
    };
};