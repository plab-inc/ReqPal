package inc.plab.bpmn.delegate;

import org.camunda.bpm.engine.delegate.DelegateExecution;
import org.camunda.bpm.engine.delegate.JavaDelegate;
import org.springframework.stereotype.Component;

import java.util.Date;

@Component
public class LessonTimerDelegate implements JavaDelegate {
    @Override
    public void execute(DelegateExecution delegateExecution) throws Exception {
        if (delegateExecution.getEventName().equals("start")) {
            delegateExecution.setVariable("taskStartTime", new Date());
        }
        if (delegateExecution.getEventName().equals("end")) {
            Date taskStartTime = (Date) delegateExecution.getVariable("taskStartTime");
            Date taskEndTime = new Date();
            delegateExecution.setVariable("taskEndTime", taskEndTime);

            if (taskStartTime != null) {
                long durationMillis = taskEndTime.getTime() - taskStartTime.getTime();
                long durationMinutes = (long) Math.ceil(durationMillis / 60000.0);
                delegateExecution.setVariable("lastLessonCompletionTimeMinutes", durationMinutes);
            }
        }
    }
}