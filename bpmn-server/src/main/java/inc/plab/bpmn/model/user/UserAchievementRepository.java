package inc.plab.bpmn.model.user;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface UserAchievementRepository extends JpaRepository<UserAchievement, UUID> {
    Optional<UserAchievement> findByUserIdAndAchievementId(UUID userId, UUID achievementId);
}