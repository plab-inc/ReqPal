package inc.plab.bpmn.delegate.camunda;

import inc.plab.bpmn.model.question.evaluation.LessonResult;
import inc.plab.bpmn.service.LessonService;
import inc.plab.bpmn.service.UserScenarioProgressService;
import org.camunda.bpm.engine.delegate.DelegateExecution;
import org.camunda.bpm.engine.delegate.JavaDelegate;
import org.camunda.spin.json.SpinJsonNode;
import org.springframework.stereotype.Component;

import java.util.Date;

@Component
public class LessonUserTaskDelegate implements JavaDelegate {

    final LessonService lessonService;
    final UserScenarioProgressService userscenarioProgressService;

    public LessonUserTaskDelegate(LessonService lessonService, UserScenarioProgressService userscenarioProgressService) {
        this.lessonService = lessonService;
        this.userscenarioProgressService = userscenarioProgressService;
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

        LessonResult lessonResult = lessonService.evaluateLesson(lessonId, lastLessonResult);
        if (lessonResult != null) {
            userscenarioProgressService.addLessonResult(lessonResult);
            int newScore = (int) Math.round(lessonResult.getTotalScore());
            userscenarioProgressService.addPointsToScore(newScore);

            for (SpinJsonNode lesson : allLessonResults.elements()) {
                if (lesson.prop("lessonId").stringValue().equals(lessonId)) {
                    lesson.prop("achievedPoints", newScore);
                    break;
                }
            }

            delegateExecution.setVariable("lastLessonAchievedPoints", lessonResult.getTotalScore());
            delegateExecution.setVariable("totalPoints", currentTotalPoints + newScore);
            delegateExecution.setVariable("lessonResults", allLessonResults);
        }
    }
}
