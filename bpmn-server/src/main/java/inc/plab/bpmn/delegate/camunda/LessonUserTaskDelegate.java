package inc.plab.bpmn.delegate.camunda;

import inc.plab.bpmn.service.LessonService;
import org.camunda.bpm.engine.delegate.DelegateExecution;
import org.camunda.bpm.engine.delegate.JavaDelegate;
import org.camunda.spin.json.SpinJsonNode;
import org.springframework.stereotype.Component;

import java.util.Date;

@Component
public class LessonUserTaskDelegate implements JavaDelegate {

    final LessonService lessonService;

    public LessonUserTaskDelegate(LessonService lessonService) {
        this.lessonService = lessonService;
    }

    @Override
    public void execute(DelegateExecution delegateExecution) {

        lessonTaskTimer(delegateExecution);

        if (delegateExecution.getEventName().equals("end")) {
            evaluateLessonTask(delegateExecution);
        }

    }

    private void lessonTaskTimer(DelegateExecution delegateExecution) {
        if (delegateExecution.getEventName().equals("start")) {
            delegateExecution.setVariable("lastLessonStartTime", new Date());
        }

        if (delegateExecution.getEventName().equals("end")) {
            Date taskStartTime = (Date) delegateExecution.getVariable("lastLessonStartTime");
            Date taskEndTime = new Date();
            delegateExecution.setVariable("taskEndTime", taskEndTime);

            if (taskStartTime != null) {
                long durationMillis = taskEndTime.getTime() - taskStartTime.getTime();
                long durationMinutes = (long) Math.ceil(durationMillis / 60000.0);
                delegateExecution.setVariable("lastLessonCompletionTimeMinutes", durationMinutes);
            }
        }
    }

    private void evaluateLessonTask(DelegateExecution delegateExecution) {
        String lessonId = (String) delegateExecution.getVariable("lessonId");
        int currentTotalPoints = (int) delegateExecution.getVariable("totalPoints");
        SpinJsonNode lastLessonResult = (SpinJsonNode) delegateExecution.getVariable("lastLessonResult");
        SpinJsonNode allLessonResults = (SpinJsonNode) delegateExecution.getVariable("lessonResults");

        int achievedPoints = lessonService.evaluateLesson(lessonId, lastLessonResult);

        for (SpinJsonNode lesson : allLessonResults.elements()) {
            if (lesson.prop("lessonId").stringValue().equals(lessonId)) {
                lesson.prop("achievedPoints", achievedPoints);
                break;
            }
        }

        delegateExecution.setVariable("lastLessonAchievedPoints", achievedPoints);
        delegateExecution.setVariable("totalPoints", currentTotalPoints + achievedPoints);
        delegateExecution.setVariable("lessonResults", allLessonResults);
    }


}
