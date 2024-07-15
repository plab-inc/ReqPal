package inc.plab.bpmn.delegate;

import inc.plab.bpmn.service.AchievementService;
import org.camunda.bpm.engine.delegate.DelegateExecution;
import org.camunda.bpm.engine.delegate.JavaDelegate;
import org.springframework.stereotype.Component;

@Component
public class AchievementServiceTaskDelegate implements JavaDelegate {

    final AchievementService achievementService;

    public AchievementServiceTaskDelegate(AchievementService achievementService) {
        this.achievementService = achievementService;
    }

    @Override
    public void execute(DelegateExecution delegateExecution) {

        String userId = (String) delegateExecution.getVariable("studentId");
        String achievementId = (String) delegateExecution.getVariable("achievementId");

        achievementService.addAchievementToUser(achievementId, userId);
    }
}
