package inc.plab.bpmn.websecurity;

import inc.plab.bpmn.model.supabase.SupabaseUser;
import inc.plab.bpmn.model.user.Profile;
import inc.plab.bpmn.service.SupabaseService;
import lombok.AllArgsConstructor;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.UUID;

@AllArgsConstructor
@Service
public class SupabaseAuthService implements UserDetailsService {

    private final SupabaseService supabaseService;

    @Override
    public SupabaseUser loadUserByUsername(String token) throws UsernameNotFoundException {
        SupabaseUser user = supabaseService.getUserFromToken(UUID.fromString(token));

        if (user == null) {
            throw new UsernameNotFoundException("User not found");
            //TODO add handling
        }

        Profile profileToUser = supabaseService.getProfileToUser(user);

        if (profileToUser == null) {
            throw new UsernameNotFoundException("Profile to user not found");
            //TODO add handling
        }

        user.setProfile(profileToUser);

        return user;
    }
}