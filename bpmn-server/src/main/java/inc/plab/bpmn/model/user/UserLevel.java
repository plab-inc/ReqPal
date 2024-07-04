package inc.plab.bpmn.model.user;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import java.util.UUID;
import java.time.LocalDateTime;
import inc.plab.bpmn.model.goal.LearningGoal;

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
    @JoinColumn(name = "user_id", nullable = false)
    private Profile user;

    @ManyToOne(fetch = FetchType.LAZY)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JoinColumn(name = "learning_objective_id", nullable = false)
    private LearningGoal learningGoal;

    @Column(name = "xp", nullable = false)
    private Integer xp;

    @Column(name = "xp_threshold", nullable = false)
    private Integer xpThreshold;

    @Column(name = "level", nullable = false)
    private Integer level;

    @Column(name = "max", nullable = false)
    private Boolean max;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

}
