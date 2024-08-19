import {supabase} from "@/plugins/supabase.ts";
import {
    Achievement,
    ReqPalAchievement,
    ReqPalAchievementLevelDTO,
    StudentAchievement,
    StudentReqPalAchievement
} from "@/types/achievement.ts";
import {createPathToImage} from "@/utils/achievementImage.ts";
import {mapToReqPalAchievement} from "@/mapper/reqPalAchievement.ts";
import {
    mapToStudentAchievement,
    mapToStudentReqPalAchievement,
    mapToStudentReqPalAchievementWithLevels
} from "@/mapper/studentAchievement.ts";

class AchievementServiceClass {

    public push = {
        uploadAchievement: this.uploadAchievement.bind(this),
        updateAchievement: this.updateAchievement.bind(this),
        deleteAchievement: this.deleteAchievement.bind(this),
        deleteReqPalAchievement: this.deleteReqPalAchievement.bind(this),
        uploadReqPalAchievement: this.uploadReqPalAchievement.bind(this),
        updateReqPalAchievement: this.updateReqPalAchievement.bind(this),
        deleteReqPalAchievementLevel: this.deleteReqPalAchievementLevel.bind(this),
        uploadReqPalAchievementLevel: this.uploadReqPalAchievementLevel.bind(this),
        updateReqPalAchievementLevel: this.updateReqPalAchievementLevel.bind(this)
    };

    public pull = {
        fetchAchievementsByUser: this.fetchAchievementsByUser.bind(this),
        fetchAchievementsByStudent: this.fetchAchievementsByStudent.bind(this),
        fetchReqPalAchievementsByStudent: this.fetchReqPalAchievementsByStudent.bind(this),
        fetchPreviousReqPalAchievementLevels: this.fetchPreviousReqPalAchievementLevels.bind(this),
        fetchAchievementImages: this.fetchAchievementImages.bind(this),
        fetchReqPalAchievementsByModerator: this.fetchReqPalAchievementsByModerator.bind(this),
        fetchAchievementsByIds: this.fetchAchievementsByIds.bind(this)
    }

    private async fetchAchievementsByUser(userUUID: string): Promise<Achievement[] | undefined> {

        const {data, error} = await supabase
            .from('achievements')
            .select('*')
            .eq("user_id", userUUID);

        if (error) throw error;

        if (data) {
            return data as Achievement[];
        }
    }

    private async fetchAchievementsByStudent(userUUID: string): Promise<StudentAchievement[] | undefined> {

        const {data, error} = await supabase
            .from('user_achievements')
            .select('*, achievements:achievements(title, description, image)')
            .eq("user_id", userUUID);

        if (error) throw error;

        if (data && data.length > 0) {
            const result: StudentAchievement[] = [];
            data.forEach(d => {
                result.push(mapToStudentAchievement(d));
            })
            return result;
        }
    }

    private async fetchReqPalAchievementsByStudent(userUUID: string): Promise<StudentReqPalAchievement[] | undefined> {

        const {data, error} = await supabase
            .from('user_reqpal_achievements')
            .select('*, reqpal_achievement_level:reqpal_achievement_level_id(level, threshold, title, description, image, xp), reqpal_achievement:reqpal_achievements(id, description)')
            .eq("user_id", userUUID);

        if (error) throw error;

        if (data && data.length > 0) {
            const result: StudentReqPalAchievement[] = [];
            data.forEach(d => {
                result.push(mapToStudentReqPalAchievement(d));
            })
            return result;
        }
    }

    private async fetchPreviousReqPalAchievementLevels(studentReqPalAchievement: StudentReqPalAchievement): Promise<StudentReqPalAchievement | undefined> {
        const currentLevel = studentReqPalAchievement.currentLevel.level;
        const level = currentLevel > 1 ? currentLevel : 1;

        const {data, error} = await supabase
            .from('reqpal_achievement_levels')
            .select('level, threshold, title, description, image, xp')
            .lte('level', level)
            .eq("reqpal_achievement_id", studentReqPalAchievement.reqPalAchievementId);

        if (error) throw error;

        if (data && data.length > 0) {
            return mapToStudentReqPalAchievementWithLevels(studentReqPalAchievement, data);
        }
    }

    private async fetchAchievementsByIds(achievementIds: string[]): Promise<Achievement[] | undefined> {
        const {data, error} = await supabase
            .from('achievements')
            .select('*')
            .in("id", achievementIds);

        if (error) throw error;

        if (data) {
            return data as Achievement[];
        }
    }

    private async uploadAchievement(achievement: Achievement, userUUID: string): Promise<Achievement | undefined> {
        const {data, error} = await supabase
            .from('achievements')
            .insert(
                {
                    user_id: userUUID,
                    title: achievement.title,
                    description: achievement.description,
                    image: achievement.image,
                }
            )
            .select()

        if (error) throw error;

        if (data && data.length > 0) {
            return data[0] as Achievement;
        }
    }

    private async updateAchievement(achievement: Achievement): Promise<void> {
        if (!achievement.id) {
            throw new Error("Achievement Id not found.")
        }
        const {error} = await supabase
            .from("achievements")
            .update({
                title: achievement.title,
                description: achievement.description,
                image: achievement.image
            })
            .eq("id", achievement.id);

        if (error) {
            throw error;
        }
    }

    async deleteAchievement(achievementId: string): Promise<void> {
        const {data, error} = await supabase
            .from("achievements")
            .delete()
            .eq("id", achievementId)
            .select();

        if (error) throw error;
    }

    async fetchAchievementImages(folderName: string): Promise<any> {
        const {data, error} = await supabase
            .storage
            .from('achievement-images')
            .list(folderName, {
                limit: 100,
                offset: 0,
                sortBy: {column: 'name', order: 'asc'},
            })
        if (error) throw error;
        if (data) {
            let images: string[] = [];
            data.forEach(d => {
                images.push(createPathToImage(folderName, d.name));
            })
            return images;
        }
    }

    private async fetchReqPalAchievementsByModerator(): Promise<ReqPalAchievement[] | undefined> {

        const {data, error} = await supabase
            .from('reqpal_achievements')
            .select(`
            *,
            reqpal_achievement_levels(*)
        `);

        if (error) throw error;

        if (data) {
            let result: ReqPalAchievement[] = [];

            data.forEach(d => {
                const mapped: ReqPalAchievement = mapToReqPalAchievement(d, true);
                result.push(mapped);
            });

            return result;
        }
    }

    private async uploadReqPalAchievement(achievement: ReqPalAchievement, userUUID: string): Promise<ReqPalAchievement | undefined> {
        const {data, error} = await supabase
            .from('reqpal_achievements')
            .insert(
                {
                    user_id: userUUID,
                    description: achievement.description,
                    target_field: achievement.target_field
                }
            )
            .select()

        if (error) throw error;

        if (data && data.length > 0) {
            return mapToReqPalAchievement(data[0], false);
        }
    }

    private async updateReqPalAchievement(achievement: ReqPalAchievement): Promise<void> {
        if (!achievement.id) {
            throw new Error("Achievement Id not found.")
        }
        const {error} = await supabase
            .from("reqpal_achievements")
            .update({
                description: achievement.description,
                target_field: achievement.target_field
            })
            .eq("id", achievement.id);

        if (error) {
            throw error;
        }
    }

    async deleteReqPalAchievement(achievementId: string): Promise<void> {
        const {data, error} = await supabase
            .from("reqpal_achievements")
            .delete()
            .eq("id", achievementId)
            .select();

        if (error) throw error;
    }

    private async uploadReqPalAchievementLevel(achievementLevel: ReqPalAchievementLevelDTO): Promise<ReqPalAchievementLevelDTO | undefined> {
        const {data, error} = await supabase
            .from('reqpal_achievement_levels')
            .insert(
                {
                    reqpal_achievement_id: achievementLevel.reqpal_achievement_id,
                    title: achievementLevel.title,
                    description: achievementLevel.description,
                    level: achievementLevel.level,
                    threshold: achievementLevel.threshold,
                    image: achievementLevel.image,
                    xp: achievementLevel.xp
                }
            )
            .select()

        if (error) throw error;

        if (data && data.length > 0) {
            return data[0];
        }
    }

    private async updateReqPalAchievementLevel(achievementLevel: ReqPalAchievementLevelDTO): Promise<void> {
        if (!achievementLevel.id) {
            throw new Error("Achievement Level Id not found.")
        }
        const {error} = await supabase
            .from("reqpal_achievement_levels")
            .update({
                title: achievementLevel.title,
                level: achievementLevel.level,
                description: achievementLevel.description,
                threshold: achievementLevel.threshold,
                image: achievementLevel.image,
                xp: achievementLevel.xp
            })
            .eq("id", achievementLevel.id);

        if (error) {
            throw error;
        }
    }

    async deleteReqPalAchievementLevel(achievementLevelId: string): Promise<void> {
        const {data, error} = await supabase
            .from("reqpal_achievement_levels")
            .delete()
            .eq("id", achievementLevelId)
            .select();

        if (error) throw error;
    }
}

const AchievementService = new AchievementServiceClass();

export default AchievementService;