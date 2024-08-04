package inc.plab.bpmn.model.productRequirement;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface ProductRequirementRepository extends JpaRepository<ProductRequirement, UUID> {
    Optional<ProductRequirement> findByProductIdAndRequirementId(UUID productId, UUID requirementId);
}