package inc.plab.bpmn.service.supabase;

import inc.plab.bpmn.model.supabase.SupabaseUser;
import inc.plab.bpmn.model.supabase.SupabaseUserRepository;
import inc.plab.bpmn.model.user.Profile;
import inc.plab.bpmn.model.user.ProfileRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.UUID;

@AllArgsConstructor
@Service
public class SupabaseService {

    private final SupabaseUserRepository supabaseUserRepository;
    private final ProfileRepository profileRepository;

    public SupabaseUser getUserFromToken(UUID tokenUUID) {
        return supabaseUserRepository.findById(tokenUUID).orElse(null);
    }

    public Profile getProfileToUser(SupabaseUser user) {
        return profileRepository.findById(user.getId()).orElse(null);
    }

}