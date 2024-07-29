package inc.plab.bpmn.service;

import inc.plab.bpmn.model.question.evaluation.LessonResult;
import inc.plab.bpmn.model.scenarioProgress.UserScenarioProgress;
import inc.plab.bpmn.model.scenarioProgress.UserScenarioProgressRepository;
import inc.plab.bpmn.model.scenarioProgress.converter.gainedAchievements.GainedAchievements;
import inc.plab.bpmn.model.scenarioProgress.converter.objectives.GainedObjective;
import inc.plab.bpmn.model.scenarioProgress.converter.objectives.GainedObjectives;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@Transactional
@AllArgsConstructor
public class UserScenarioProgressService {

    private final UserScenarioProgressRepository userScenarioProgressRepository;

    public void addGainedAchievement(String achievementId) {
        //TODO use scenario id and user id here to get progress
        Optional<UserScenarioProgress> userScenarioProgressOptional = userScenarioProgressRepository.findById(UUID.fromString("73cdf010-564b-46d4-89bf-b5c8e81686b8"));
        UserScenarioProgress userScenarioProgress;
        userScenarioProgress = userScenarioProgressOptional.orElseGet(UserScenarioProgress::new);
        GainedAchievements gainedAchievements = userScenarioProgress.getAchievements();
        if (gainedAchievements == null) {
            gainedAchievements = new GainedAchievements();
            gainedAchievements.getGainedAchievements().add(achievementId);
        } else {
            List<String> gainedAchievementList = gainedAchievements.getGainedAchievements();
            if (!gainedAchievementList.contains(achievementId)) {
                gainedAchievementList.add(achievementId);
            }
        }

        userScenarioProgress.setAchievements(gainedAchievements);
        userScenarioProgressRepository.save(userScenarioProgress);
    }

    public void addLessonResult(LessonResult lessonResult) {
        //TODO use scenario id and user id here to get progress
        Optional<UserScenarioProgress> userScenarioProgressOptional = userScenarioProgressRepository.findById(UUID.fromString("73cdf010-564b-46d4-89bf-b5c8e81686b8"));
        UserScenarioProgress userScenarioProgress;
        userScenarioProgress = userScenarioProgressOptional.orElseGet(UserScenarioProgress::new);

        List<LessonResult> lessonResults = userScenarioProgress.getLessonResults();
        if (lessonResults == null) {
            lessonResults = new ArrayList<>();
            lessonResults.add(lessonResult);
        } else {
            boolean lessonIdExists = lessonResults.stream()
                    .anyMatch(existingResult -> existingResult.getLessonId().equals(lessonResult.getLessonId()));
            if (!lessonIdExists) {
                lessonResults.add(lessonResult);
            }
        }

        userScenarioProgress.setLessonResults(lessonResults);
        userScenarioProgressRepository.save(userScenarioProgress);
    }

    public void addObjectiveAndXp(String objectiveId, int xp) {
        //TODO use scenario id and user id here to get progress
        Optional<UserScenarioProgress> userScenarioProgressOptional = userScenarioProgressRepository.findById(UUID.fromString("73cdf010-564b-46d4-89bf-b5c8e81686b8"));
        UserScenarioProgress userScenarioProgress;
        userScenarioProgress = userScenarioProgressOptional.orElseGet(UserScenarioProgress::new);

        GainedObjective newGainedObjective = new GainedObjective(objectiveId, xp);
        GainedObjectives gainedObjectives = userScenarioProgress.getObjectives();

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
        userScenarioProgress.setObjectives(gainedObjectives);
        userScenarioProgressRepository.save(userScenarioProgress);
    }

    public void addPointsToScore(int points) {
        //TODO use scenario id and user id here to get progress
        Optional<UserScenarioProgress> userScenarioProgressOptional = userScenarioProgressRepository.findById(UUID.fromString("73cdf010-564b-46d4-89bf-b5c8e81686b8"));
        UserScenarioProgress userScenarioProgress;
        userScenarioProgress = userScenarioProgressOptional.orElseGet(UserScenarioProgress::new);

        int currentScore = userScenarioProgress.getScore();
        userScenarioProgress.setScore(currentScore + points);
        userScenarioProgressRepository.save(userScenarioProgress);
    }

}
