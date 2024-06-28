package inc.plab.bpmn.model.lesson;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;
import java.util.UUID;

public interface LessonRepository extends JpaRepository<Lesson, UUID> {

    @Query("SELECT l FROM Lesson l WHERE l.uuid = :uuid")
    Optional<Lesson> findByUuid(@Param("uuid") UUID uuid);

    default Optional<Lesson> findByUuidString(String uuidString) {
        UUID uuid = UUID.fromString(uuidString);
        return findByUuid(uuid);
    }
}