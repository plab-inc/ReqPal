package inc.plab.bpmn.model.user;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface UserLevelRepository extends JpaRepository<UserLevel, UUID> {

    Optional<UserLevel> findByUserIdAndLearningGoalId(UUID userId, UUID learningGoalId);
}