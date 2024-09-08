package inc.plab.bpmn.service.lesson;

import inc.plab.bpmn.mapper.QuestionAnswerMapper;
import inc.plab.bpmn.model.lesson.Lesson;
import inc.plab.bpmn.model.lesson.LessonObjective;
import inc.plab.bpmn.model.lesson.LessonRepository;
import inc.plab.bpmn.model.lesson.QuestionAnswer;
import inc.plab.bpmn.model.question.evaluation.LessonResult;
import inc.plab.bpmn.model.question.evaluation.result.Result;
import inc.plab.bpmn.service.gamification.ActivityLogService;
import inc.plab.bpmn.service.gamification.UserLevelService;
import inc.plab.bpmn.service.gamification.UserStatisticsService;
import inc.plab.bpmn.service.scenario.ScenarioUserStatisticsService;
import inc.plab.bpmn.validation.JsonValidator;
import lombok.AllArgsConstructor;
import org.camunda.spin.json.SpinJsonNode;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;

@Service
@AllArgsConstructor
public class LessonService {
    final EvaluationService evaluationService;
    final LessonRepository lessonRepository;
    final UserLevelService userLevelService;
    final ScenarioUserStatisticsService scenarioUserStatisticsService;
    final ActivityLogService activityLogService;
    final UserStatisticsService userStatisticsService;

    public LessonResult evaluateLesson(String lessonId, SpinJsonNode lessonAnswers) {
        JsonValidator.validateJson(lessonAnswers.toString());
        List<QuestionAnswer> questionAnswers = QuestionAnswerMapper.mapToQuestionAnswer(lessonAnswers);

        LessonResult lessonResult = new LessonResult();
        lessonResult.setLessonId(lessonId);
        List<Result> results = lessonResult.getResults();

        for (QuestionAnswer answer : questionAnswers) {
            Result res = evaluationService.evaluateQuestionType(answer);
            if (res != null) {
                results.add(res);
                lessonResult.addPointsToTotalScore(res.getScore());
            }
        }
        return lessonResult;
    }

    public void grantPointsAsXpToLessonObjectives(String lessonId, int points, String userId, String scenarioId) {
        Optional<Lesson> lessonOptional = lessonRepository.findByUuid(UUID.fromString(lessonId));
        Lesson lesson = lessonOptional.orElseThrow(() -> new IllegalArgumentException("Lesson not found"));

        Set<LessonObjective> lessonObjectives = lesson.getLessonObjectives();
        if (!lessonObjectives.isEmpty()) {
            for (LessonObjective objective : lessonObjectives) {
                String objectiveId = String.valueOf(objective.getObjective().getId());
                userLevelService.addXpToObjectiveForUser(points, objectiveId, userId);
                userStatisticsService.addToTotalObjectiveXp(points, userId);
                scenarioUserStatisticsService.addObjectiveAndXp(objectiveId, points, userId, scenarioId);
            }
            activityLogService.addLogEntryForAllLessonObjectives(points, userId);
        }
    }
}
