package inc.plab.bpmn.delegate.camunda;

import inc.plab.bpmn.service.ActivityLogService;
import inc.plab.bpmn.service.LevelService;
import inc.plab.bpmn.service.ScenarioUserStatisticsService;
import inc.plab.bpmn.service.UserStatisticService;
import org.camunda.bpm.engine.delegate.DelegateExecution;
import org.camunda.bpm.engine.delegate.JavaDelegate;
import org.springframework.stereotype.Component;

@Component
public class XpDelegate implements JavaDelegate {

    final UserStatisticService userStatisticService;
    final LevelService levelService;
    final ScenarioUserStatisticsService scenarioUserStatisticsService;
    final ActivityLogService activityLogService;

    public XpDelegate(UserStatisticService userStatisticService, LevelService levelService, ScenarioUserStatisticsService scenarioUserStatisticsService, ActivityLogService activityLogService) {
        this.userStatisticService = userStatisticService;
        this.levelService = levelService;
        this.scenarioUserStatisticsService = scenarioUserStatisticsService;
        this.activityLogService = activityLogService;
    }

    @Override
    public void execute(DelegateExecution delegateExecution) {
        String userId = (String) delegateExecution.getVariable("studentId");
        String scenarioId = (String) delegateExecution.getVariable("scenarioId");
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
            userStatisticService.addToTotalObjectiveXp(xp, userId);
            scenarioUserStatisticsService.addObjectiveAndXp(objectiveId, xp, userId, scenarioId);
            activityLogService.addLogEntryForObjective(xp, objectiveId, userId);
        } else {
            throw new Error("XP needs to be a positive number greater than 0.");
        }
    }
}
