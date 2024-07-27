package inc.plab.bpmn.model.scenario;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface UserScenarioRepository extends JpaRepository<UserScenario, UUID> {
    Optional<UserScenario> findByScenarioAndUser_Id(Scenario scenario, UUID id);
}