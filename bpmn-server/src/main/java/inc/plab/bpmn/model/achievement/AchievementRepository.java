package inc.plab.bpmn.model.achievement;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface AchievementRepository extends JpaRepository<Achievement, UUID> {
}