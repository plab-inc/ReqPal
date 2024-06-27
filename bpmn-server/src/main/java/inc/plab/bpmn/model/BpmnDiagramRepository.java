package inc.plab.bpmn.model;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface BpmnDiagramRepository extends JpaRepository<BpmnDiagram, UUID> {
}