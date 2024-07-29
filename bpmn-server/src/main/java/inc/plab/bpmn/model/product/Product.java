package inc.plab.bpmn.model.product;

import inc.plab.bpmn.model.productRequirement.ProductRequirement;
import inc.plab.bpmn.model.user.Profile;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.ColumnDefault;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import java.util.LinkedHashSet;
import java.util.Set;
import java.util.UUID;

@Getter
@Setter
@Entity
@Table(name = "products")
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @ColumnDefault("uuid_generate_v4()")
    @Column(name = "product_id", nullable = false)
    private UUID id;

    @NotNull
    @Column(name = "product_name", nullable = false, length = Integer.MAX_VALUE)
    private String productName;

    @NotNull
    @Column(name = "product_url", nullable = false, length = Integer.MAX_VALUE)
    private String productUrl;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JoinColumn(name = "user_id", nullable = false)
    private Profile user;

    @Column(name = "normalized_product_name", length = Integer.MAX_VALUE)
    private String normalizedProductName;

    @OneToMany(mappedBy = "product")
    private Set<ProductRequirement> productRequirements = new LinkedHashSet<>();

}