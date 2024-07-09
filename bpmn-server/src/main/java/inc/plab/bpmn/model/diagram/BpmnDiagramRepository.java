package inc.plab.bpmn.model.diagram;

import inc.plab.bpmn.model.user.Profile;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface BpmnDiagramRepository extends JpaRepository<BpmnDiagram, UUID> {
    Optional<BpmnDiagram> findByIdAndProfile(UUID id, Profile profile);
}