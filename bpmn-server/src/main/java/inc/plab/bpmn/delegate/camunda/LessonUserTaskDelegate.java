package inc.plab.bpmn.delegate.camunda;

import inc.plab.bpmn.model.question.evaluation.LessonResult;
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
            System.out.println("Out of Delegate");
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

        LessonResult lessonResult = lessonService.evaluateLesson(lessonId, lastLessonResult);
        int newScore = (int) Math.round(lessonResult.getTotalScore());

        for (SpinJsonNode lesson : allLessonResults.elements()) {
            if (lesson.prop("lessonId").stringValue().equals(lessonId)) {
                lesson.prop("achievedPoints", newScore);
                break;
            }
        }

        delegateExecution.setVariable("lastLessonAchievedPoints", lessonResult.getTotalScore());
        delegateExecution.setVariable("totalPoints", currentTotalPoints + newScore);
        delegateExecution.setVariable("lessonResults", allLessonResults);
        System.out.println("End of Delegate");
    }
}
