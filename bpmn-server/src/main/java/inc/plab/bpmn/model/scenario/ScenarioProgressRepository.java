package inc.plab.bpmn.model.scenario;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface ScenarioProgressRepository extends JpaRepository<ScenarioProgress, UUID> {
    Optional<ScenarioProgress> findByScenarioAndUser_Id(Scenario scenario, UUID id);
}