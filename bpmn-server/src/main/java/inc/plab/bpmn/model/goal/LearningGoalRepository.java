package inc.plab.bpmn.model.goal;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface LearningGoalRepository extends JpaRepository<LearningGoal, UUID> {
}