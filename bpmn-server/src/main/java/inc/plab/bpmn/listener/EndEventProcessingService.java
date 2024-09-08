package inc.plab.bpmn.listener;

import inc.plab.bpmn.model.scenarioStatistics.ScenarioUserStatistics;
import inc.plab.bpmn.service.gamification.ActivityLogService;
import inc.plab.bpmn.service.gamification.UserStatisticsService;
import inc.plab.bpmn.service.scenario.ScenarioUserStatisticsService;
import org.camunda.bpm.engine.delegate.DelegateExecution;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class EndEventProcessingService {

    private final UserStatisticsService userStatisticsService;
    private final ScenarioUserStatisticsService scenarioUserStatisticsService;
    private final ActivityLogService activityLogService;

    @Autowired
    public EndEventProcessingService(UserStatisticsService userStatisticsService, ScenarioUserStatisticsService scenarioUserStatisticsService, ActivityLogService activityLogService) {
        this.userStatisticsService = userStatisticsService;
        this.scenarioUserStatisticsService = scenarioUserStatisticsService;
        this.activityLogService = activityLogService;
    }

    public void processEndEvent(DelegateExecution execution) {
        String userId = (String) execution.getVariable("studentId");
        String scenarioId = (String) execution.getVariable("scenarioId");

        userStatisticsService.addToTotalScenarios(1, userId);
        userStatisticsService.addToTotalReqPalXp(25, userId);
        activityLogService.addLogEntryForFinishedScenario(25, userId);

        ScenarioUserStatistics scenarioUserStatistics = scenarioUserStatisticsService.getScenarioUserStatistics(userId, scenarioId);
        if (scenarioUserStatistics != null) {
            Integer newScore = scenarioUserStatistics.getScore();
            if (newScore != null && newScore > 0) {
                userStatisticsService.addToTotalPoints(newScore, userId);
            }
        }
    }
}
