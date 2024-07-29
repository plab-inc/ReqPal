package inc.plab.bpmn.service;

import inc.plab.bpmn.mapper.Answer;
import inc.plab.bpmn.mapper.LessonAnswer;
import inc.plab.bpmn.mapper.LessonMapper;
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
}
