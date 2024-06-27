package inc.plab.bpmn.delegate;

import inc.plab.bpmn.service.LessonService;
import org.camunda.bpm.engine.delegate.DelegateExecution;
import org.camunda.bpm.engine.delegate.JavaDelegate;
import org.camunda.spin.json.SpinJsonNode;
import org.springframework.stereotype.Component;

import java.util.Random;

@Component
public class LessonPointsDelegate implements JavaDelegate {

    final LessonService lessonService;

    public LessonPointsDelegate(LessonService lessonService) {
        this.lessonService = lessonService;
    }

    @Override
    public void execute(DelegateExecution delegateExecution) throws Exception {
        Random random = new Random();
        String lessonId = (String) delegateExecution.getVariable("lessonId");

        int currentTotalPoints = (int) delegateExecution.getVariable("totalPoints");
        int pointsToAdd = random.nextInt(101);

        delegateExecution.setVariable("lastLessonAchievedPoints", pointsToAdd);
        delegateExecution.setVariable("totalPoints", currentTotalPoints + pointsToAdd);

        SpinJsonNode lessonResultsNode = (SpinJsonNode) delegateExecution.getVariable("lessonResults");

        for (SpinJsonNode lesson : lessonResultsNode.prop("lessons").elements()) {
            if (lesson.prop("lessonId").stringValue().equals(lessonId)) {
                lesson.prop("achievedPoints", pointsToAdd);
                break;
            }
        }

        delegateExecution.setVariable("lessonResults", lessonResultsNode);
    }
}