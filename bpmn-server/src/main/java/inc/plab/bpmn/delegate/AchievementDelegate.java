package inc.plab.bpmn.delegate;

import inc.plab.bpmn.service.gamification.AchievementService;
import inc.plab.bpmn.service.gamification.ActivityLogService;
import inc.plab.bpmn.service.gamification.UserStatisticsService;
import inc.plab.bpmn.service.scenario.ScenarioUserStatisticsService;
import org.camunda.bpm.engine.delegate.DelegateExecution;
import org.camunda.bpm.engine.delegate.JavaDelegate;
import org.springframework.stereotype.Component;

@Component
public class AchievementDelegate implements JavaDelegate {

    final AchievementService achievementService;
    final ScenarioUserStatisticsService scenarioUserStatisticsService;
    final ActivityLogService activityLogService;
    final UserStatisticsService userStatisticsService;

    public AchievementDelegate(AchievementService achievementService, ScenarioUserStatisticsService scenarioUserStatisticsService, ActivityLogService activityLogService, UserStatisticsService userStatisticsService) {
        this.achievementService = achievementService;
        this.scenarioUserStatisticsService = scenarioUserStatisticsService;
        this.activityLogService = activityLogService;
        this.userStatisticsService = userStatisticsService;
    }

    @Override
    public void execute(DelegateExecution delegateExecution) {
        int achievementXp = 25;
        String userId = (String) delegateExecution.getVariable("studentId");
        String achievementId = (String) delegateExecution.getVariable("achievementId");
        String scenarioId = (String) delegateExecution.getVariable("scenarioId");
        achievementService.addAchievementToUser(achievementId, userId);
        scenarioUserStatisticsService.addGainedAchievement(achievementId, userId, scenarioId);
        activityLogService.addLogEntryForAchievement(achievementXp, achievementId, userId);
        userStatisticsService.addToTotalReqPalXp(achievementXp, userId);
    }
}
