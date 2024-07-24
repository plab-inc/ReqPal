package inc.plab.bpmn.model.scenario;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface ScenarioRepository extends JpaRepository<Scenario, UUID> {
    Optional<Scenario> findByIdAndUser_Id(UUID id, UUID id1);
}