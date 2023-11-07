import {supabase} from "@/plugins/supabase";

class ProfileServiceClass {

    public push = {};

    public pull = {
        fetchProfile: this.fetchProfile.bind(this),
        fetchPoints: this.fetchPoints.bind(this),
        getAvatar: this.getAvatar.bind(this),
        getUsername: this.getUsername.bind(this),
    }

    private async fetchProfile(userId: string) {

        const {data, error} = await supabase
            .from('profiles')
            .select('*')
            .eq('id', userId)
            .single();

        if (error) throw error;

        return data;

    }

    private async fetchPoints(userId: string) {
        const {data, error} = await supabase
            .from('user_points')
            .select('points')
            .eq('user_id', userId)
            .single();

        if (error) throw error;

        return data;
    }

    private async getUsername(userId: string) {
        const {data, error} = await supabase
            .from('profiles')
            .select('username')
            .eq('id', userId)
            .single();

        if (error) throw error;

        return data;

    }

    private async getAvatar(userId: string) {
        const {data, error} = await supabase
            .from('profiles')
            .select('avatar')
            .eq('id', userId)
            .single();

        if (error) throw error;

        return data;

    }
}

const ProfileService = new ProfileServiceClass();

export default ProfileService;