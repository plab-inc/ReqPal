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
@AllArgsConstructor
public class GamificationService {

    private final LearningGoalRepository learningGoalRepository;
    private final UserLevelRepository userLevelRepository;
    private final ProfileRepository profileRepository;

    public void hello() {
        System.out.println("Hello from GamificationService");
    }

    @Transactional
    public void addXpToLearningObjectiveForUser(int xp, String objectiveId, String userId) {
        UUID userUUID = UUID.fromString(userId);
        UUID learningObjectiveUUID = UUID.fromString(objectiveId);

        System.out.println("Adding XP from GamificationService");

        Optional<LearningGoal> learningGoalOptional = learningGoalRepository.findById(learningObjectiveUUID);
        LearningGoal learningGoal = learningGoalOptional.orElseThrow(() -> new IllegalArgumentException("Learning Objective not found"));

        Optional<Profile> profileOptional = profileRepository.findById(userUUID);
        Profile profile = profileOptional.orElseThrow(() -> new IllegalArgumentException("Profile not found"));

        Optional<UserLevel> userLevelOptional = userLevelRepository.findByUserIdAndLearningGoalId(userUUID, learningObjectiveUUID);
        UserLevel userLevel;

        userLevel = userLevelOptional.orElseGet(() -> initiateUserLevelForLearningObjective(learningGoal, profile));

        if (!userLevel.getMax()) {
            int newXp = xp + userLevel.getXp();

            if (newXp >= userLevel.getXpThreshold()) {
                userLevel = updateLearningObjectiveLevel(learningGoal, userLevel, newXp);
            } else {
                System.out.println("save xp without updating level");
                userLevel.setXp(newXp);
                userLevelRepository.save(userLevel);
            }
        }

        //TODO save xp for total xp
        System.out.println("save xp for total xp stats");
        System.out.println("new level: " + userLevel);
    }

    private UserLevel updateLearningObjectiveLevel(LearningGoal learningObjective, UserLevel userLevel, int newXp) {
        System.out.println("update level");

        int newLevel = userLevel.getLevel();
        int maxLevel = learningObjective.getMaxLevel();
        int currentThreshold = userLevel.getXpThreshold();

        while (newXp >= currentThreshold && newLevel < maxLevel) {
            newLevel++;
            newXp -= currentThreshold;
            if(newXp < 0) newXp = 0;
            currentThreshold = calculateThreshold(newLevel);
        }

        if (newLevel >= maxLevel) {
            System.out.println("Max level reached");
            newLevel = maxLevel;
            userLevel.setMax(true);
            userLevel.setXp(userLevel.getXpThreshold());
        } else {
            System.out.println("New level reached");
            userLevel.setXp(newXp);
            userLevel.setXpThreshold(currentThreshold);
            userLevel.setMax(false);
        }

        userLevel.setLevel(newLevel);
        return userLevelRepository.save(userLevel);
    }

    private int calculateThreshold(int currentLevel) {
        System.out.println("calculate threshold");
        int baseXp = 25;
        return baseXp + (baseXp * (currentLevel + 1));
    }

    private UserLevel initiateUserLevelForLearningObjective(LearningGoal learningObjective, Profile user) {
        System.out.println("Initiate user level");

        int defaultLevel = 0;
        int defaultXp = 0;
        int threshold = calculateThreshold(defaultLevel);

        UserLevel userLevel = new UserLevel();
        userLevel.setLevel(defaultLevel);
        userLevel.setXp(defaultXp);
        userLevel.setXpThreshold(threshold);
        userLevel.setUser(user);
        userLevel.setMax(false);
        userLevel.setLearningGoal(learningObjective);

        userLevelRepository.save(userLevel);
        return userLevel;
    }
}