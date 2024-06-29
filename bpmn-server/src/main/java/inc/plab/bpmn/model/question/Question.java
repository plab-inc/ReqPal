package inc.plab.bpmn.model.question;

import inc.plab.bpmn.model.lesson.Lesson;
import inc.plab.bpmn.model.user.UserAnswer;
import inc.plab.bpmn.model.user.UserHint;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;
import org.hibernate.type.SqlTypes;

import java.util.LinkedHashSet;
import java.util.Map;
import java.util.Set;
import java.util.UUID;

@Getter
@Setter
@Entity
@Table(name = "questions")
public class Question {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "uuid", nullable = false)
    private UUID id;

    @Column(name = "question", length = Integer.MAX_VALUE)
    private String question;

    @Column(name = "solution")
    @JdbcTypeCode(SqlTypes.JSON)
    private Map<String, Object> solution;

    @NotNull
    @Column(name = "question_type", nullable = false, length = Integer.MAX_VALUE)
    private String questionType;

    @Column(name = "options")
    @JdbcTypeCode(SqlTypes.JSON)
    private Map<String, Object> options;

    @Column(name = "hint", length = Integer.MAX_VALUE)
    private String hint;

    @NotNull
    @Column(name = "position", nullable = false)
    private Integer position;

    @ManyToOne(fetch = FetchType.LAZY)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JoinColumn(name = "lesson_uuid")
    private Lesson lessonUuid;

    @Column(name = "points")
    private Integer points;

    @OneToMany(mappedBy = "question")
    private Set<UserAnswer> userAnswers = new LinkedHashSet<>();

    @OneToMany(mappedBy = "question")
    private Set<UserHint> userHints = new LinkedHashSet<>();

}