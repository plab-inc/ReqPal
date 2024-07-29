package inc.plab.bpmn.model.scenarioProgress;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface UserScenarioProgressRepository extends JpaRepository<UserScenarioProgress, UUID> {
}