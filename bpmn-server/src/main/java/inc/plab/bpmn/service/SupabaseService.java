package inc.plab.bpmn.service;

import inc.plab.bpmn.model.supabase.SupabaseUser;
import inc.plab.bpmn.model.supabase.SupabaseUserRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.UUID;

@AllArgsConstructor
@Service
public class SupabaseService {

    private final SupabaseUserRepository supabaseUserRepository;

    public SupabaseUser getUserFromToken(String token) {
        return supabaseUserRepository.findById(UUID.fromString(token)).orElse(null);
    }

}