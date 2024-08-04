package inc.plab.bpmn.model.objective;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface ObjectiveRepository extends JpaRepository<Objective, UUID> {
}