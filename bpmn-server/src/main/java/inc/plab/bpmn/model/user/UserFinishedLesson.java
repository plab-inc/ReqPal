package inc.plab.bpmn.model.user;

import inc.plab.bpmn.model.lesson.Lesson;
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
@Table(name = "user_finished_lessons")
public class UserFinishedLesson {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id", nullable = false)
    private UUID id;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JoinColumn(name = "user_id", nullable = false)
    private Profile user;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JoinColumn(name = "lesson_id", nullable = false)
    private Lesson lesson;

    @Column(name = "finished")
    private Boolean finished;

    @Column(name = "is_started")
    private Boolean isStarted;

    @ColumnDefault("'0'::real")
    @Column(name = "user_points")
    private Float userPoints;

    @Column(name = "finished_for_first_time")
    private Boolean finishedForFirstTime;

    @ColumnDefault("0")
    @Column(name = "used_hints")
    private Integer usedHints;

    @ColumnDefault("'0'::real")
    @Column(name = "new_user_points")
    private Float newUserPoints;

}