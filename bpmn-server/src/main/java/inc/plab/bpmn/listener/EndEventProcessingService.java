package inc.plab.bpmn.listener;

import inc.plab.bpmn.model.scenarioStatistics.ScenarioUserStatistics;
import inc.plab.bpmn.service.ActivityLogService;
import inc.plab.bpmn.service.ScenarioUserStatisticsService;
import inc.plab.bpmn.service.UserStatisticService;
import org.camunda.bpm.engine.delegate.DelegateExecution;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class EndEventProcessingService {

    private final UserStatisticService userStatisticService;
    private final ScenarioUserStatisticsService scenarioUserStatisticsService;
    private final ActivityLogService activityLogService;

    @Autowired
    public EndEventProcessingService(UserStatisticService userStatisticService, ScenarioUserStatisticsService scenarioUserStatisticsService, ActivityLogService activityLogService) {
        this.userStatisticService = userStatisticService;
        this.scenarioUserStatisticsService = scenarioUserStatisticsService;
        this.activityLogService = activityLogService;
    }

    public void processEndEvent(DelegateExecution execution) {
        String userId = (String) execution.getVariable("studentId");
        String scenarioId = (String) execution.getVariable("scenarioId");

        userStatisticService.addToTotalScenarios(1, userId);
        userStatisticService.addToTotalReqPalXp(25, userId);
        activityLogService.addLogEntryForFinishedScenario(25, userId);

        ScenarioUserStatistics scenarioUserStatistics = scenarioUserStatisticsService.getScenarioUserStatistics(userId, scenarioId);
        if (scenarioUserStatistics != null) {
            Integer newScore = scenarioUserStatistics.getScore();
            if (newScore != null && newScore > 0) {
                userStatisticService.addToTotalPoints(newScore, userId);
            }
        }
    }
}
