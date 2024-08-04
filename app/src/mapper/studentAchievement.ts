import {StudentAchievement, StudentReqPalAchievement, StudentReqPalAchievementLevel} from "@/types/achievement.ts";

export const mapToStudentAchievement = (input: any): StudentAchievement => {
    const achievement = input.achievements;

    return {
        amount: input.amount ? input.amount : 0,
        created_at: input.created_at,
        description: achievement ? achievement.description : "",
        image: achievement ? achievement.image : "",
        title: achievement ? achievement.title : ""
    };
};

export const mapToStudentReqPalAchievement = (input: any): StudentReqPalAchievement => {

    let level: StudentReqPalAchievementLevel = {
        image: "", level: 0, threshold: 0, title: "", description: "", xp: 0
    }

    const achievement = input.reqpal_achievement;

    if (input.reqpal_achievement_level) {
        level.image = input.reqpal_achievement_level.image;
        level.level = input.reqpal_achievement_level.level;
        level.description = input.reqpal_achievement_level.description;
        level.threshold = input.reqpal_achievement_level.threshold;
        level.title = input.reqpal_achievement_level.title;
        level.xp = input.reqpal_achievement_level.xp;
    }

    return {
        created_at: input.created_at,
        description: achievement ? achievement.description : "",
        example: achievement ? achievement.example : false,
        currentLevel: level,
        previousLevels: [],
        max: input.max,
        reqPalAchievementId: achievement ? achievement.id : ""
    };
};

export const mapToStudentReqPalAchievementWithLevels = (studentReqPalAchievement: StudentReqPalAchievement, inputLevels: any): StudentReqPalAchievement => {

    const levels: StudentReqPalAchievementLevel[] = [];

    if (inputLevels && Array.isArray(inputLevels) && inputLevels.length > 0) {
        inputLevels.forEach((level: any) => {
            levels.push({
                image: level.image, level: level.level, threshold: level.threshold, title: level.title, description: level.description, xp: level.xp
            })
        })
    }

    studentReqPalAchievement.previousLevels = levels;
    return studentReqPalAchievement;
};