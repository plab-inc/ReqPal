package inc.plab.bpmn.websecurity;

import inc.plab.bpmn.model.supabase.SupabaseUser;
import inc.plab.bpmn.service.SupabaseService;
import lombok.AllArgsConstructor;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@AllArgsConstructor
@Service
public class SupabaseAuthService implements UserDetailsService {

    private final SupabaseService supabaseService;

    @Override
    public SupabaseUser loadUserByUsername(String token) throws UsernameNotFoundException {
        SupabaseUser user = supabaseService.getUserFromToken(token);
        if (user == null) {
            throw new UsernameNotFoundException("User not found");
            //TODO add handling
        }
        return user;
    }
}