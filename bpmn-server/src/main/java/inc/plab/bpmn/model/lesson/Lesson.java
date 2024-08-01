package inc.plab.bpmn.model.lesson;

import inc.plab.bpmn.model.question.Question;
import inc.plab.bpmn.model.user.*;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.ColumnDefault;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import java.time.Instant;
import java.util.LinkedHashSet;
import java.util.Set;
import java.util.UUID;

@Getter
@Setter
@Entity
@Table(name = "lessons")
public class Lesson {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @ColumnDefault("uuid_generate_v4()")
    @Column(name = "uuid", nullable = false)
    private UUID id;

    @NotNull
    @Column(name = "description", nullable = false, length = Integer.MAX_VALUE)
    private String description;

    @NotNull
    @Column(name = "title", nullable = false, length = Integer.MAX_VALUE)
    private String title;

    @Column(name = "points")
    private Integer points;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JoinColumn(name = "user_id", nullable = false)
    private Profile user;

    @NotNull
    @ColumnDefault("false")
    @Column(name = "published", nullable = false)
    private Boolean published = false;

    @NotNull
    @ColumnDefault("false")
    @Column(name = "example", nullable = false)
    private Boolean example = false;

    @NotNull
    @ColumnDefault("CURRENT_TIMESTAMP")
    @Column(name = "created_at", nullable = false)
    private Instant createdAt;

    @OneToMany(mappedBy = "lesson")
    private Set<LessonObjective> lessonObjectives = new LinkedHashSet<>();

    @OneToMany(mappedBy = "lessonUuid")
    private Set<Question> questions = new LinkedHashSet<>();

    @OneToMany(mappedBy = "lesson")
    private Set<UserLessonProgress> userLessonProgresses = new LinkedHashSet<>();

}