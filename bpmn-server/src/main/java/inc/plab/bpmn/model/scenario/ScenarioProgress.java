package inc.plab.bpmn.model.scenario;

import inc.plab.bpmn.model.lesson.Lesson;
import inc.plab.bpmn.model.lesson.QuestionAnswer;
import inc.plab.bpmn.model.user.Profile;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;

@Getter
@Setter
@Entity
@Table(name = "scenario_user_progress", schema = "public")
public class ScenarioProgress {
    @Id
    @Column(name = "id", nullable = false)
    private UUID id;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private Profile user;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "scenario_id", nullable = false)
    private Scenario scenario;

    @NotNull
    @Column(name = "created_at", nullable = false)
    private OffsetDateTime createdAt;

    @NotNull
    @Column(name = "started", nullable = false)
    private Boolean started = false;

    @NotNull
    @Column(name = "ended", nullable = false)
    private Boolean ended = false;

    @NotNull
    @Column(name = "step", nullable = false)
    private Long currentStep;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "lesson_Id")
    private Lesson currentLesson;

    @NotNull
    @Column(name = "started_version", nullable = false)
    private Long startedVersion;

    @Column(name = "lesson_answers")
    @JdbcTypeCode(SqlTypes.JSON)
    private List<QuestionAnswer> lessonAnswers;

    @Transient
    public void increaseStep() {
        this.currentStep++;
    }
}