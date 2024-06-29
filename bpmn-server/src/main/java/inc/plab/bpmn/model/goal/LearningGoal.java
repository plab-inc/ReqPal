package inc.plab.bpmn.model.goal;

import inc.plab.bpmn.model.lesson.Lesson;
import inc.plab.bpmn.model.user.Profile;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import java.util.LinkedHashSet;
import java.util.Set;
import java.util.UUID;

@Getter
@Setter
@Entity
@Table(name = "learning_goals")
public class LearningGoal {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id", nullable = false)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JoinColumn(name = "user_id")
    private Profile user;

    @Column(name = "name", length = Integer.MAX_VALUE)
    private String name;

    @Column(name = "description", length = Integer.MAX_VALUE)
    private String description;

    @Column(name = "max_level")
    private Integer maxLevel;

    @OneToMany(mappedBy = "learningGoal")
    private Set<Lesson> lessons = new LinkedHashSet<>();

}