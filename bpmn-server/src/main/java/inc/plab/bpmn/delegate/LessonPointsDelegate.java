package inc.plab.bpmn.delegate;

import inc.plab.bpmn.service.LessonService;
import org.camunda.bpm.engine.delegate.DelegateExecution;
import org.camunda.bpm.engine.delegate.JavaDelegate;
import org.springframework.stereotype.Component;

@Component
public class LessonPointsDelegate implements JavaDelegate {

    final LessonService lessonService;

    public LessonPointsDelegate(LessonService lessonService) {
        this.lessonService = lessonService;
    }

    @Override
    public void execute(DelegateExecution delegateExecution) throws Exception {
        String lessonId = (String) delegateExecution.getVariable("lessonId");
        //TODO
    }
}
