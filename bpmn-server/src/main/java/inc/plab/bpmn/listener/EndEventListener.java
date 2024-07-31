package inc.plab.bpmn.listener;

import org.camunda.bpm.engine.delegate.DelegateExecution;
import org.camunda.bpm.engine.delegate.ExecutionListener;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class EndEventListener implements ExecutionListener {
    private final EndEventProcessingService endEventProcessingService;

    @Autowired
    public EndEventListener(EndEventProcessingService endEventProcessingService) {
        this.endEventProcessingService = endEventProcessingService;
    }

    @Override
    public void notify(DelegateExecution execution) {
        endEventProcessingService.processEndEvent(execution);
    }
}
