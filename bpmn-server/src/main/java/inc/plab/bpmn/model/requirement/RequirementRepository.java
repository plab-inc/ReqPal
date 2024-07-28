package inc.plab.bpmn.model.requirement;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface RequirementRepository extends JpaRepository<Requirement, UUID> {
}