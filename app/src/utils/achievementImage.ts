export const createPathToImage = (folder: string, imageName: string): string => {
    return "/" + folder + "/" + imageName;
};

export const getAchievementImageUrl = (path: string) => {
    const url = import.meta.env.VITE_SUPABASE_URL + "/storage/v1/object/public/achievement-images";
    return url + path;
}