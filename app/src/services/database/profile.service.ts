import {supabase} from "@/plugins/supabase";

class ProfileServiceClass {

    public push = {
        updateProfileUsername: this.updateProfileUsername.bind(this),
        updateProfileAvatar: this.updateProfileAvatar.bind(this),
    };

    public pull = {
        fetchProfile: this.fetchProfile.bind(this),
        fetchPoints: this.fetchPoints.bind(this),
        getAvatar: this.getAvatar.bind(this),
        getUsername: this.getUsername.bind(this),
        checkIfUsernameExists: this.checkIfUsernameExists.bind(this)
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

    private async checkIfUsernameExists(username: string) {
        const {data, error, status, count} = await supabase
            .from('profiles')
            .select('username', {count: 'exact', head: true})
            .eq('username', username)

        if (error) throw error;

        if (count) {
            return count > 0;
        }
    }

    private async updateProfileUsername(userUUID: string, username: string) {
        const {data, error} = await supabase
            .from('profiles')
            .update({username: username})
            .eq('id', userUUID)

        if (error) throw error;

        return data;
    }

    private async updateProfileAvatar(userUUID: string, avatar: string) {
        const {data, error} = await supabase
            .from('profiles')
            .update({avatar: avatar})
            .eq('id', userUUID)

        if (error) throw error;

        return data;
    }
}

const ProfileService = new ProfileServiceClass();

export default ProfileService;