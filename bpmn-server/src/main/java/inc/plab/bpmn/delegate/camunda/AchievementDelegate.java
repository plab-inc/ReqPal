package inc.plab.bpmn.delegate.camunda;

import inc.plab.bpmn.service.AchievementService;
import inc.plab.bpmn.service.ActivityLogService;
import inc.plab.bpmn.service.ScenarioUserStatisticsService;
import inc.plab.bpmn.service.UserStatisticService;
import org.camunda.bpm.engine.delegate.DelegateExecution;
import org.camunda.bpm.engine.delegate.JavaDelegate;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

@Component
public class AchievementDelegate implements JavaDelegate {

    final AchievementService achievementService;
    final ScenarioUserStatisticsService scenarioUserStatisticsService;
    final ActivityLogService activityLogService;
    final UserStatisticService userStatisticService;

    public AchievementDelegate(AchievementService achievementService, ScenarioUserStatisticsService scenarioUserStatisticsService, ActivityLogService activityLogService, UserStatisticService userStatisticService) {
        this.achievementService = achievementService;
        this.scenarioUserStatisticsService = scenarioUserStatisticsService;
        this.activityLogService = activityLogService;
        this.userStatisticService = userStatisticService;
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
        userStatisticService.addToTotalReqPalXp(achievementXp, userId);
        addAchievementToVariable(delegateExecution, achievementId);
    }

    private void addAchievementToVariable(DelegateExecution delegateExecution, String achievementId) {
        Object currentGainedAchievements = delegateExecution.getVariable("gainedAchievements");
        List<String> gainedAchievements;

        if (currentGainedAchievements instanceof List<?> tempList) {
            gainedAchievements = new ArrayList<>();
            tempList.forEach(item -> {
                if (item instanceof String) {
                    gainedAchievements.add((String) item);
                }
            });

        } else if (currentGainedAchievements != null && currentGainedAchievements.getClass().isArray() &&
                currentGainedAchievements.getClass().getComponentType() == String.class) {
            gainedAchievements = new ArrayList<>(Arrays.asList((String[]) currentGainedAchievements));
        } else {
            gainedAchievements = new ArrayList<>();
        }

        gainedAchievements.add(achievementId);
        delegateExecution.setVariable("gainedAchievements", gainedAchievements);
    }
}
