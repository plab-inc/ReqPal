package inc.plab.bpmn.service;

import inc.plab.bpmn.model.question.evaluation.LessonResult;
import inc.plab.bpmn.model.scenario.ScenarioProgress;
import inc.plab.bpmn.model.scenario.ScenarioProgressRepository;
import inc.plab.bpmn.model.scenarioStatistics.ScenarioUserStatistics;
import inc.plab.bpmn.model.scenarioStatistics.ScenarioUserStatisticsRepository;
import inc.plab.bpmn.model.scenarioStatistics.converter.gainedAchievements.GainedAchievements;
import inc.plab.bpmn.model.scenarioStatistics.converter.objectives.GainedObjective;
import inc.plab.bpmn.model.scenarioStatistics.converter.objectives.GainedObjectives;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@Transactional
@AllArgsConstructor
public class ScenarioUserStatisticsService {

    private final ScenarioUserStatisticsRepository scenarioUserStatisticsRepository;
    private final ScenarioProgressRepository scenarioProgressRepository;

    public void addGainedAchievement(String achievementId, String userId, String scenarioId) {
        ScenarioUserStatistics scenarioUserStatistics = getScenarioUserStatistics(userId, scenarioId);

        if (scenarioUserStatistics == null) return;

        GainedAchievements gainedAchievements = scenarioUserStatistics.getAchievements();
        if (gainedAchievements == null) {
            gainedAchievements = new GainedAchievements();
            gainedAchievements.getGainedAchievements().add(achievementId);
        } else {
            List<String> gainedAchievementList = gainedAchievements.getGainedAchievements();
            if (!gainedAchievementList.contains(achievementId)) {
                gainedAchievementList.add(achievementId);
            }
        }

        scenarioUserStatistics.setAchievements(gainedAchievements);
        scenarioUserStatisticsRepository.save(scenarioUserStatistics);
    }


    public void addLessonResult(LessonResult lessonResult, String userId, String scenarioId) {
        ScenarioUserStatistics scenarioUserStatistics = getScenarioUserStatistics(userId, scenarioId);

        if (scenarioUserStatistics == null) return;

        List<LessonResult> lessonResults = scenarioUserStatistics.getLessonResults();
        if (lessonResults == null) {
            lessonResults = new ArrayList<>();
        }

        lessonResults.add(lessonResult);

        scenarioUserStatistics.setLessonResults(lessonResults);
        scenarioUserStatisticsRepository.save(scenarioUserStatistics);
    }

    public void addObjectiveAndXp(String objectiveId, int xp, String userId, String scenarioId) {
        ScenarioUserStatistics scenarioUserStatistics = getScenarioUserStatistics(userId, scenarioId);

        if (scenarioUserStatistics == null) return;

        GainedObjective newGainedObjective = new GainedObjective(objectiveId, xp);
        GainedObjectives gainedObjectives = scenarioUserStatistics.getObjectives();

        if (gainedObjectives == null) {
            gainedObjectives = new GainedObjectives();
            gainedObjectives.getGainedObjectives().add(newGainedObjective);
        } else {
            List<GainedObjective> gainedObjectiveList = gainedObjectives.getGainedObjectives();
            int index = gainedObjectiveList.indexOf(newGainedObjective);

            if (index == -1) {
                gainedObjectiveList.add(newGainedObjective);
            } else {
                GainedObjective existingObjective = gainedObjectiveList.get(index);
                int newXp = existingObjective.getXp() + newGainedObjective.getXp();
                existingObjective.setXp(newXp);
            }
        }
        scenarioUserStatistics.setObjectives(gainedObjectives);
        scenarioUserStatisticsRepository.save(scenarioUserStatistics);
    }

    public void addPointsToScore(int points, String userId, String scenarioId) {
        ScenarioUserStatistics scenarioUserStatistics = getScenarioUserStatistics(userId, scenarioId);

        if (scenarioUserStatistics == null) return;

        Integer currentScore = scenarioUserStatistics.getScore();
        if (currentScore == null) {
            currentScore = 0;
        }
        scenarioUserStatistics.setScore(currentScore + points);
        scenarioUserStatisticsRepository.save(scenarioUserStatistics);
    }

    public ScenarioUserStatistics getScenarioUserStatistics(String userId, String scenarioId) {
        Optional<ScenarioProgress> scenarioProgressOptional = scenarioProgressRepository.findByScenarioIdAndUser_Id(UUID.fromString(scenarioId), UUID.fromString(userId));
        if (scenarioProgressOptional.isPresent()) {
            ScenarioProgress scenarioProgress = scenarioProgressOptional.get();
            Optional<ScenarioUserStatistics> scenarioUserStatisticsOptional = scenarioUserStatisticsRepository.findByScenarioProgress(scenarioProgress);
            ScenarioUserStatistics scenarioUserStatistics;

            if (scenarioUserStatisticsOptional.isPresent()) {
                scenarioUserStatistics = scenarioUserStatisticsOptional.get();
            } else {
                scenarioUserStatistics = new ScenarioUserStatistics();
                scenarioUserStatistics.setScenarioProgress(scenarioProgress);
                scenarioUserStatistics.setCreatedAt(OffsetDateTime.now());
            }

            return scenarioUserStatistics;
        }
        return null;
    }
}
