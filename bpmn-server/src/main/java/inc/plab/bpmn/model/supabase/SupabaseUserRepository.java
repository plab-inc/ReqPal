package inc.plab.bpmn.model.supabase;

import inc.plab.bpmn.model.supabase.SupabaseUser;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface SupabaseUserRepository extends JpaRepository<SupabaseUser, UUID> {
}