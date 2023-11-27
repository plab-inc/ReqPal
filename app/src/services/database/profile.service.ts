import {supabase} from "@/plugins/supabase";
import {ProfileDTO} from "@/types/auth.types.ts";

class ProfileServiceClass {

    public push = {
        updateProfileUsername: this.updateProfileUsername.bind(this),
        updateProfileAvatar: this.updateProfileAvatar.bind(this),
    };

    public pull = {
        fetchProfile: this.fetchProfile.bind(this),
        fetchTeachers: this.getTeachers.bind(this),
        fetchPoints: this.fetchPoints.bind(this),
        getAvatar: this.getAvatar.bind(this),
        getUsername: this.getUsername.bind(this),
        checkIfUsernameExists: this.checkIfUsernameExists.bind(this),
        checkIfUsernameExistsExcludingUUID: this.checkIfUsernameExistsExcludingUUID.bind(this)
    }

    private async fetchProfile(userId: string): Promise<ProfileDTO | undefined> {

        const {data, error} = await supabase
            .from('profiles')
            .select('*')
            .eq('id', userId)
            .single();

        if (error) throw error;

        return data;

    }

    private async fetchPoints(userId: string): Promise<{ points: number } | null> {
        const {data, error} = await supabase
            .from('user_points')
            .select('points')
            .eq('user_id', userId)
            .maybeSingle()

        if (error) throw error;

        return data;
    }

    private async getUsername(userId: string): Promise<{ username: string }> {
        const {data, error} = await supabase
            .from('profiles')
            .select('username')
            .eq('id', userId)
            .single();

        if (error) throw error;

        return data;

    }

    private async getAvatar(userId: string): Promise<{ avatar: string }> {
        const {data, error} = await supabase
            .from('profiles')
            .select('avatar')
            .eq('id', userId)
            .single();

        if (error) throw error;

        return data;
    }

    private async getTeachers(): Promise<ProfileDTO[] | undefined> {
        const {data, error} = await supabase
            .from('profiles')
            .select('*')
            .eq('role', 'teacher')

        if (error) throw error;

        if (data && data.length > 0) {
            return data;
        }
    }

    private async checkIfUsernameExists(username: string): Promise<boolean | undefined> {
        const {error, count} = await supabase
            .from('profiles')
            .select('username', {count: 'exact', head: true})
            .eq('username', username)

        if (error) throw error;

        if (count) {
            return count > 0;
        }
    }

    private async checkIfUsernameExistsExcludingUUID(username: string, userUUID: string): Promise<boolean | undefined> {
        const {error, count} = await supabase
            .from('profiles')
            .select('username', {count: 'exact', head: true})
            .eq('username', username)
            .not('id', 'eq', userUUID);

        if (error) throw error;

        if (count) {
            return count > 0;
        }
    }

    private async updateProfileUsername(userUUID: string, username: string): Promise<void> {
        const {error} = await supabase
            .from('profiles')
            .update({username: username})
            .eq('id', userUUID)

        if (error) throw error;
    }

    private async updateProfileAvatar(userUUID: string, avatar: string): Promise<void> {
        const {error} = await supabase
            .from('profiles')
            .update({avatar: avatar})
            .eq('id', userUUID)

        if (error) throw error;
    }
}

const ProfileService: ProfileServiceClass = new ProfileServiceClass();

export default ProfileService;