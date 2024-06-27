package inc.plab.bpmn.model;

import org.springframework.data.jpa.repository.JpaRepository;

public interface BpmnDiagramRepository extends JpaRepository<BpmnDiagram, Long> {
}