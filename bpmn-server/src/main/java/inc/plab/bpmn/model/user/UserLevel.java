package inc.plab.bpmn.model.user;

import inc.plab.bpmn.model.goal.LearningGoal;
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
@Table(name = "user_levels")
public class UserLevel {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id", nullable = false)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JoinColumn(name = "user_id")
    private Profile user;

    @ManyToOne(fetch = FetchType.LAZY)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JoinColumn(name = "learning_objective_id")
    private LearningGoal learningObjective;

    @ColumnDefault("0")
    @Column(name = "xp")
    private Integer xp;

    @Column(name = "xp_threshold")
    private Integer xpThreshold;

    @ColumnDefault("0")
    @Column(name = "level")
    private Integer level;

    @ColumnDefault("false")
    @Column(name = "max")
    private Boolean max;

    @NotNull
    @ColumnDefault("now()")
    @Column(name = "created_at", nullable = false)
    private OffsetDateTime createdAt;

}