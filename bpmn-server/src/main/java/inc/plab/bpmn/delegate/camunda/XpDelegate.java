package inc.plab.bpmn.delegate.camunda;

import inc.plab.bpmn.service.LevelService;
import inc.plab.bpmn.service.UserScenarioProgressService;
import org.camunda.bpm.engine.delegate.DelegateExecution;
import org.camunda.bpm.engine.delegate.JavaDelegate;
import org.springframework.stereotype.Component;

@Component
public class XpDelegate implements JavaDelegate {

    final LevelService levelService;
    final UserScenarioProgressService userscenarioProgressService;

    public XpDelegate(LevelService levelService, UserScenarioProgressService userscenarioProgressService) {
        this.levelService = levelService;
        this.userscenarioProgressService = userscenarioProgressService;
    }

    @Override
    public void execute(DelegateExecution delegateExecution) {
        String userId = (String) delegateExecution.getVariable("studentId");
        String objectiveId = (String) delegateExecution.getVariable("objectiveId");
        int xp;
        try {
            String xpString = (String) delegateExecution.getVariable("xp");
            xp = Integer.parseInt(xpString);
        } catch (NumberFormatException e) {
            throw new Error("XP could not be parsed. XP needs to be a number: " + e.getMessage());
        }

        if (xp > 0) {
            levelService.addXpToObjectiveForUser(xp, objectiveId, userId);
            userscenarioProgressService.addObjectiveAndXp(objectiveId, xp);
        } else {
            throw new Error("XP needs to be a positive number greater than 0.");
        }
    }
}
