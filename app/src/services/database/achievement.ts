import {supabase} from "@/plugins/supabase.ts";
import {Achievement} from "@/types/achievement.ts";

class AchievementServiceClass {

    public push = {
        uploadAchievement: this.uploadAchievement.bind(this),
        updateAchievement: this.updateAchievement.bind(this),
        deleteAchievement: this.deleteAchievement.bind(this)
    };

    public pull = {
        fetchAchievementsByUser: this.fetchAchievementsByUser.bind(this)
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

        if(data && data.length > 0) {
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
}

const AchievementService = new AchievementServiceClass();

export default AchievementService;