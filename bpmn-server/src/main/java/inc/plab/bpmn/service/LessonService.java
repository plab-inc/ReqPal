package inc.plab.bpmn.service;

import inc.plab.bpmn.mapper.Answer;
import inc.plab.bpmn.mapper.LessonAnswer;
import inc.plab.bpmn.mapper.LessonMapper;
import inc.plab.bpmn.model.lesson.Lesson;
import inc.plab.bpmn.model.lesson.LessonObjective;
import inc.plab.bpmn.model.lesson.LessonRepository;
import inc.plab.bpmn.model.question.evaluation.*;
import inc.plab.bpmn.model.question.evaluation.result.*;
import inc.plab.bpmn.validation.JsonValidator;
import lombok.AllArgsConstructor;
import org.camunda.spin.json.SpinJsonNode;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
@AllArgsConstructor
public class LessonService {
    final EvaluationService evaluationService;
    final LessonRepository lessonRepository;
    final LevelService levelService;
    final ScenarioUserStatisticsService scenarioUserStatisticsService;
    final ActivityLogService activityLogService;
    final UserStatisticService userStatisticService;

    public LessonResult evaluateLesson(String lessonId, SpinJsonNode lessonAnswer) {
        JsonValidator.validateJson(lessonAnswer.toString());
        LessonAnswer lessonAnswerObject = LessonMapper.mapToLessonAnswer(lessonAnswer);

        LessonResult lessonResult = new LessonResult();
        lessonResult.setLessonId(lessonId);
        List<Result> results = lessonResult.getResults();

        for (Answer answer : lessonAnswerObject.getAnswers()) {
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
                levelService.addXpToObjectiveForUser(points, objectiveId, userId);
                userStatisticService.addToTotalObjectiveXp(points, userId);
                scenarioUserStatisticsService.addObjectiveAndXp(objectiveId, points, userId, scenarioId);
            }
            activityLogService.addLogEntryForAllLessonObjectives(points, userId);
        }
    }
}
