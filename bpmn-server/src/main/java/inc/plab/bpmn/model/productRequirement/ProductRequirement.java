package inc.plab.bpmn.model.productRequirement;

import inc.plab.bpmn.model.requirement.Requirement;
import inc.plab.bpmn.model.product.Product;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.ColumnDefault;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import java.util.UUID;

@Getter
@Setter
@Entity
@Table(name = "product_requirements")
public class ProductRequirement {
    @Id
    @ColumnDefault("uuid_generate_v4()")
    @Column(name = "product_requirement_id", nullable = false)
    private UUID id;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JoinColumn(name = "requirement_id", nullable = false)
    private Requirement requirement;

    @NotNull
    @ColumnDefault("1")
    @Column(name = "qualification", nullable = false)
    private Integer qualification;

    @ColumnDefault("'Kommentar'::text")
    @Column(name = "comment", length = Integer.MAX_VALUE)
    private String comment;

}