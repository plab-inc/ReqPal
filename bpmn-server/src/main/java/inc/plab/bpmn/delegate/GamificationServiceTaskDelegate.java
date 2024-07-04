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

        if (delegateExecution.getEventName().equals("addXp")) {
            addXpToLearningObjectiveForUser(delegateExecution);
        }

    }

    private void addXpToLearningObjectiveForUser(DelegateExecution delegateExecution) {

        String userId = (String) delegateExecution.getVariable("userId");
        String learningObjectiveId = (String) delegateExecution.getVariable("learningObjectiveId");
        int xp = (int) delegateExecution.getVariable("xp");

        gamificationService.addXpToLearningObjectiveForUser(xp, learningObjectiveId, userId);

    }

    private void addAchievementForUser(DelegateExecution delegateExecution) {

        String userId = (String) delegateExecution.getVariable("userId");
        String learningObjectiveId = (String) delegateExecution.getVariable("achievementId");

        // call service to add achievement
    }
}
