import {supabase} from "@/plugins/supabase.ts";
import {Achievement} from "@/types/achievement.ts";
import {createPathToImage} from "@/utils/achievementImage.ts";

class AchievementServiceClass {

    public push = {
        uploadAchievement: this.uploadAchievement.bind(this),
        updateAchievement: this.updateAchievement.bind(this),
        deleteAchievement: this.deleteAchievement.bind(this)
    };

    public pull = {
        fetchAchievementsByUser: this.fetchAchievementsByUser.bind(this),
        fetchAchievementImagesBadges: this.fetchAchievementImagesBadges.bind(this),
        fetchAchievementImagesBanners: this.fetchAchievementImagesBanners.bind(this)
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

    async fetchAchievementImagesBadges(): Promise<any> {
        const {data, error} = await supabase
            .storage
            .from('achievement-images')
            .list('badges', {
                limit: 100,
                offset: 0,
                sortBy: {column: 'name', order: 'asc'},
            })
        if (error) throw error;
        if (data) {
            let images: string[] = [];
            data.forEach(d => {
                images.push(createPathToImage("badges", d.name));
            })
            return images;
        }
    }

    async fetchAchievementImagesBanners(): Promise<any> {
        const {data, error} = await supabase
            .storage
            .from('achievement-images')
            .list('banners', {
                limit: 100,
                offset: 0,
                sortBy: {column: 'name', order: 'asc'},
            })
        if (error) throw error;
        if (data) {
            let images: string[] = [];
            data.forEach(d => {
                if(d.name !== ".emptyFolderPlaceholder")
                images.push(createPathToImage("banners", d.name));
            })
            return images;
        }
    }
}

const AchievementService = new AchievementServiceClass();

export default AchievementService;