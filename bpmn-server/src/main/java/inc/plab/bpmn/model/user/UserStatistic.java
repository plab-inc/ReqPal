package inc.plab.bpmn.model.user;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.ColumnDefault;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import java.time.OffsetDateTime;
import java.util.UUID;

@Getter
@Setter
@Entity
@Table(name = "user_statistics")
public class UserStatistic {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @ColumnDefault("uuid_generate_v4()")
    @Column(name = "id", nullable = false)
    private UUID id;

    @NotNull
    @ColumnDefault("now()")
    @Column(name = "created_at", nullable = false)
    private OffsetDateTime createdAt;

    @OneToOne(fetch = FetchType.LAZY)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JoinColumn(name = "user_id")
    private Profile user;

    @ColumnDefault("0")
    @Column(name = "total_reqpal_xp")
    private Integer totalReqPalXp;

    @ColumnDefault("0")
    @Column(name = "total_objective_xp")
    private Integer totalObjectiveXp;

    @ColumnDefault("0")
    @Column(name = "total_scenarios")
    private Integer totalScenarios;

    @ColumnDefault("0")
    @Column(name = "total_points")
    private Integer totalPoints;

}