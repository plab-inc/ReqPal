package inc.plab.bpmn.model.scenarioStatistics;

import inc.plab.bpmn.model.scenario.ScenarioProgress;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface ScenarioUserStatisticsRepository extends JpaRepository<ScenarioUserStatistics, UUID> {
    Optional<ScenarioUserStatistics> findByScenarioProgress(ScenarioProgress scenarioProgress);
}