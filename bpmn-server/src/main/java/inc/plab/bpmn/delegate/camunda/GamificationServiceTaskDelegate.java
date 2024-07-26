package inc.plab.bpmn.delegate.camunda;

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
        addXpToLearningObjectiveForUser(delegateExecution);

    }

    private void addXpToLearningObjectiveForUser(DelegateExecution delegateExecution) {

        String userId = (String) delegateExecution.getVariable("studentId");
        String objectiveId = (String) delegateExecution.getVariable("objectiveId");
        int xp;
        try {
            String xpString = (String) delegateExecution.getVariable("xp");
            xp = Integer.parseInt(xpString);
        } catch (NumberFormatException e) {
            throw new Error("XP could not be parsed. XP needs to be a number: " + e.getMessage());
        }

        if(xp > 0) {
            try {
                gamificationService.addXpToObjectiveForUser(xp, objectiveId, userId);
            }   catch (Exception e) {
                System.out.println(e.getMessage());
            }

        } else {
            throw new Error("XP needs to be a positive number greater than 0.");
        }
    }
}
