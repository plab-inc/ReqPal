package inc.plab.bpmn.delegate;

import inc.plab.bpmn.service.GamificationService;
import org.camunda.bpm.engine.delegate.DelegateExecution;
import org.camunda.bpm.engine.delegate.JavaDelegate;
import org.springframework.stereotype.Component;

@Component
public class GamificationTaskDelegate implements JavaDelegate {

    final GamificationService gamificationService;

    public GamificationTaskDelegate(GamificationService gamificationService) {
        this.gamificationService = gamificationService;
    }

    @Override
    public void execute(DelegateExecution delegateExecution) throws Exception {
        gamificationService.hello();
    }
}
