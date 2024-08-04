package inc.plab.bpmn.model.activityLog;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface XpActivityLogRepository extends JpaRepository<XpActivityLog, UUID> {
}