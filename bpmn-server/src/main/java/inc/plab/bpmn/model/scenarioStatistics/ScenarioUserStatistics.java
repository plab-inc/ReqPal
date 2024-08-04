package inc.plab.bpmn.model.scenarioStatistics;

import inc.plab.bpmn.model.question.evaluation.LessonResult;
import inc.plab.bpmn.model.scenario.ScenarioProgress;
import inc.plab.bpmn.model.scenarioStatistics.converter.gainedAchievements.AchievementConverter;
import inc.plab.bpmn.model.scenarioStatistics.converter.gainedAchievements.GainedAchievements;
import inc.plab.bpmn.model.scenarioStatistics.converter.lessonResults.LessonResultConverter;
import inc.plab.bpmn.model.scenarioStatistics.converter.objectives.GainedObjectives;
import inc.plab.bpmn.model.scenarioStatistics.converter.objectives.ObjectiveConverter;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.ColumnDefault;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;
import org.hibernate.type.SqlTypes;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;

@Getter
@Setter
@Entity
@Table(name = "scenario_user_statistics")
public class ScenarioUserStatistics {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @ColumnDefault("uuid_generate_v4()")
    @Column(name = "id", nullable = false)
    private UUID id;

    @NotNull
    @ColumnDefault("now()")
    @Column(name = "created_at", nullable = false)
    private OffsetDateTime createdAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JoinColumn(name = "scenario_user_progress_id")
    private ScenarioProgress scenarioProgress;

    @Column(name = "objectives")
    @JdbcTypeCode(SqlTypes.JSON)
    @Convert(converter = ObjectiveConverter.class)
    private GainedObjectives objectives;

    @Column(name = "lesson_results")
    @JdbcTypeCode(SqlTypes.JSON)
    @Convert(converter = LessonResultConverter.class)
    private List<LessonResult> lessonResults;

    @Column(name = "achievements")
    @JdbcTypeCode(SqlTypes.JSON)
    @Convert(converter = AchievementConverter.class)
    private GainedAchievements achievements;

    @Column(name = "score")
    private Integer score;
}