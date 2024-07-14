export const createPathToImage = (folder: string, imageName: string): string => {
    return "/" + folder + "/" + imageName;
};

export const getAchievementImageUrl = (path: string) => {
    const url = "https://rouarbdbmlahwttlyspf.supabase.co/storage/v1/object/public/achievement-images";
    return url + path;
}