package inc.plab.bpmn.service;

import inc.plab.bpmn.model.goal.LearningGoal;
import inc.plab.bpmn.model.goal.LearningGoalRepository;
import inc.plab.bpmn.model.user.Profile;
import inc.plab.bpmn.model.user.ProfileRepository;
import inc.plab.bpmn.model.user.UserLevel;
import inc.plab.bpmn.model.user.UserLevelRepository;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.UUID;

@Service
@Transactional
@AllArgsConstructor
public class GamificationService {

    private final LearningGoalRepository learningGoalRepository;
    private final UserLevelRepository userLevelRepository;
    private final ProfileRepository profileRepository;

    public void hello() {
        System.out.println("Hello from GamificationService");
    }

    public void addXpToLearningObjectiveForUser(int xp, String objectiveId, String userId) {
        UUID userUUID = UUID.fromString(userId);
        UUID learningObjectiveUUID = UUID.fromString(objectiveId);

        Optional<LearningGoal> learningGoalOptional = learningGoalRepository.findById(learningObjectiveUUID);
        LearningGoal learningGoal = learningGoalOptional.orElseThrow(() -> new IllegalArgumentException("Learning Objective not found"));

        Optional<Profile> profileOptional = profileRepository.findById(userUUID);
        Profile profile = profileOptional.orElseThrow(() -> new IllegalArgumentException("Profile not found"));

        Optional<UserLevel> userLevelOptional = userLevelRepository.findByUserIdAndLearningObjectiveId(userUUID, learningObjectiveUUID);
        UserLevel userLevel;

        userLevel = userLevelOptional.orElseGet(() -> initiateUserLevelForLearningObjective(learningGoal, profile));

        if (!userLevel.getMax()) {
            int newXp = xp + userLevel.getXp();

            if (newXp >= userLevel.getXpThreshold()) {
                userLevel = updateLearningObjectiveLevel(learningGoal, userLevel, newXp);
            } else {
                userLevel.setXp(newXp);
            }
        }

        userLevelRepository.save(userLevel);
    }

    private UserLevel updateLearningObjectiveLevel(LearningGoal learningObjective, UserLevel userLevel, int newXp) {
        int newLevel = userLevel.getLevel();
        int maxLevel = learningObjective.getMaxLevel();
        int currentThreshold = userLevel.getXpThreshold();

        while (newXp >= currentThreshold && newLevel < maxLevel) {
            newLevel++;
            newXp -= currentThreshold;
            if (newXp < 0) newXp = 0;
            currentThreshold = calculateThreshold(newLevel);
        }

        if (newLevel >= maxLevel) {
            newLevel = maxLevel;
            userLevel.setMax(true);
            userLevel.setXp(currentThreshold);
        } else {
            userLevel.setXp(newXp);
            userLevel.setMax(false);
        }

        userLevel.setXpThreshold(currentThreshold);
        userLevel.setLevel(newLevel);
        return userLevel;
    }

    private int calculateThreshold(int currentLevel) {
        int baseXp = 25;
        return baseXp + (baseXp * (currentLevel + 1));
    }

    private UserLevel initiateUserLevelForLearningObjective(LearningGoal learningObjective, Profile user) {
        int defaultLevel = 0;
        int defaultXp = 0;
        int threshold = calculateThreshold(defaultLevel);

        UserLevel userLevel = new UserLevel();
        userLevel.setLevel(defaultLevel);
        userLevel.setXp(defaultXp);
        userLevel.setXpThreshold(threshold);
        userLevel.setUser(user);
        userLevel.setMax(false);
        userLevel.setLearningObjective(learningObjective);

        return userLevel;
    }
}