package inc.plab.bpmn.delegate;

import inc.plab.bpmn.service.GamificationService;
import org.camunda.bpm.engine.delegate.DelegateExecution;
import org.camunda.bpm.engine.delegate.JavaDelegate;
import org.springframework.stereotype.Component;

@Component
public class GamificationServiceTaskDelegate implements JavaDelegate {

    final GamificationService gamificationService;

    public GamificationServiceTaskDelegate(GamificationService gamificationService) {
        this.gamificationService = gamificationService;
    }

    @Override
    public void execute(DelegateExecution delegateExecution) {
        gamificationService.hello();
    }
}
