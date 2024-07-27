package inc.plab.bpmn.model.question;

import inc.plab.bpmn.model.lesson.Lesson;
import inc.plab.bpmn.model.question.option.Option;
import inc.plab.bpmn.model.question.solution.Solution;
import jakarta.annotation.Nullable;
import jakarta.persistence.*;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.*;
import org.hibernate.type.SqlTypes;

import java.util.Map;
import java.util.UUID;

@Getter
@Setter
@Entity
@Table(name = "questions")
public class Question {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @ColumnDefault("uuid_generate_v4()")
    @Column(name = "uuid", nullable = false)
    private UUID id;

    @Column(name = "question", length = Integer.MAX_VALUE)
    private String question;

    @Column(name = "solution")
    @JdbcTypeCode(SqlTypes.JSON)
    @Convert(converter = SolutionConverter.class)
    private Solution solution;

    @NotNull
    @Column(name = "question_type", nullable = false, length = Integer.MAX_VALUE)
    private String questionType;

    @Column(name = "options")
    @JdbcTypeCode(SqlTypes.JSON)
    @Convert(converter = OptionConverter.class)
    private Option options;

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

}