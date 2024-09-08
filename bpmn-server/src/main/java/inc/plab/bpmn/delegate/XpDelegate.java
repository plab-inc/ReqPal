package inc.plab.bpmn.delegate;

import inc.plab.bpmn.service.gamification.ActivityLogService;
import inc.plab.bpmn.service.gamification.UserLevelService;
import inc.plab.bpmn.service.gamification.UserStatisticsService;
import inc.plab.bpmn.service.scenario.ScenarioUserStatisticsService;
import org.camunda.bpm.engine.delegate.DelegateExecution;
import org.camunda.bpm.engine.delegate.JavaDelegate;
import org.springframework.stereotype.Component;

@Component
public class XpDelegate implements JavaDelegate {

    final UserStatisticsService userStatisticsService;
    final UserLevelService userLevelService;
    final ScenarioUserStatisticsService scenarioUserStatisticsService;
    final ActivityLogService activityLogService;

    public XpDelegate(UserStatisticsService userStatisticsService, UserLevelService userLevelService, ScenarioUserStatisticsService scenarioUserStatisticsService, ActivityLogService activityLogService) {
        this.userStatisticsService = userStatisticsService;
        this.userLevelService = userLevelService;
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

        userLevelService.addXpToObjectiveForUser(xp, objectiveId, userId);
        userStatisticsService.addToTotalObjectiveXp(xp, userId);
        scenarioUserStatisticsService.addObjectiveAndXp(objectiveId, xp, userId, scenarioId);
        activityLogService.addLogEntryForObjective(xp, objectiveId, userId);
    }
}
