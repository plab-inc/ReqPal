import {supabase} from "@/plugins/supabase";

class ProfileServiceClass {

    public push = {};

    public pull = {
        fetchProfile: this.fetchProfile.bind(this),
    }

    private async fetchProfile(userId: string) {

        const storedUserData = localStorage.getItem('user');

        if (storedUserData) {
            const userData = JSON.parse(storedUserData);
            if (userId === userData.userId) {
                return userData;
            }
        }

        const {data, error} = await supabase
            .from('profiles')
            .select('username')
            .eq('id', userId)
            .single();

        if (error) throw error;

        if (data) {

            const userData = {
                userId: userId,
                username: data.username
            };

            localStorage.setItem('user', JSON.stringify(userData));
            return data;
        } else {
            return null;
        }
    }
}

const ProfileService = new ProfileServiceClass();

export default ProfileService;