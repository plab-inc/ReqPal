package inc.plab.bpmn.service;

import inc.plab.bpmn.model.supabase.SupabaseUser;
import inc.plab.bpmn.model.user.Profile;
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
        }

        Profile profileToUser = supabaseService.getProfileToUser(user);

        if (profileToUser == null) {
            throw new UsernameNotFoundException("Profile to user not found");
        }

        user.setProfile(profileToUser);

        return user;
    }
}