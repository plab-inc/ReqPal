package inc.plab.bpmn.delegate.camunda;

import inc.plab.bpmn.service.AchievementService;
import org.camunda.bpm.engine.delegate.DelegateExecution;
import org.camunda.bpm.engine.delegate.JavaDelegate;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

@Component
public class AchievementDelegate implements JavaDelegate {

    final AchievementService achievementService;

    public AchievementDelegate(AchievementService achievementService) {
        this.achievementService = achievementService;
    }

    @Override
    public void execute(DelegateExecution delegateExecution) {
        String userId = (String) delegateExecution.getVariable("studentId");
        String achievementId = (String) delegateExecution.getVariable("achievementId");
        achievementService.addAchievementToUser(achievementId, userId);
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
