package inc.plab.bpmn.model.user;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface UserLessonProgressRepository extends JpaRepository<UserLessonProgress, UUID> {
}