package inc.plab.bpmn.model.user;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface UserStatisticRepository extends JpaRepository<UserStatistic, UUID> {
    Optional<UserStatistic> findByUserId(UUID uuid);
}