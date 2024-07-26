package inc.plab.bpmn.service;

import inc.plab.bpmn.model.objective.Objective;
import inc.plab.bpmn.model.objective.ObjectiveRepository;
import inc.plab.bpmn.model.user.Profile;
import inc.plab.bpmn.model.user.ProfileRepository;
import inc.plab.bpmn.model.user.UserLevel;
import inc.plab.bpmn.model.user.UserLevelRepository;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.OffsetDateTime;
import java.util.Optional;
import java.util.UUID;

@Service
@Transactional
@AllArgsConstructor
public class LevelService {

    private final ObjectiveRepository objectiveRepository;
    private final UserLevelRepository userLevelRepository;
    private final ProfileRepository profileRepository;

    public void addXpToObjectiveForUser(int xp, String objectiveId, String userId) {
        UUID userUUID = UUID.fromString(userId);
        UUID objectiveUUID = UUID.fromString(objectiveId);

        Optional<Objective> objectiveOptional = objectiveRepository.findById(objectiveUUID);
        Objective objective = objectiveOptional.orElseThrow(() -> new IllegalArgumentException("Objective not found"));

        Optional<Profile> profileOptional = profileRepository.findById(userUUID);
        Profile profile = profileOptional.orElseThrow(() -> new IllegalArgumentException("Profile not found"));

        Optional<UserLevel> userLevelOptional = userLevelRepository.findByUserIdAndObjectiveId(userUUID, objectiveUUID);
        UserLevel userLevel;

        userLevel = userLevelOptional.orElseGet(() -> initiateUserLevelForObjective(objective, profile));

        if (!userLevel.getMax()) {
            int newXp = xp + userLevel.getXp();

            if (newXp >= userLevel.getXpThreshold()) {
                updateObjectiveLevel(objective, userLevel, newXp);
            } else {
                userLevel.setXp(newXp);
            }
        }

        userLevelRepository.save(userLevel);
    }

    private void updateObjectiveLevel(Objective objective, UserLevel userLevel, int newXp) {
        int newLevel = userLevel.getLevel();
        int maxLevel = objective.getMaxLevel();
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
    }

    private int calculateThreshold(int currentLevel) {
        int baseXp = 25;
        return baseXp + (baseXp * (currentLevel + 1));
    }

    private UserLevel initiateUserLevelForObjective(Objective objective, Profile user) {
        int defaultLevel = 0;
        int defaultXp = 0;
        int threshold = calculateThreshold(defaultLevel);

        UserLevel userLevel = new UserLevel();
        userLevel.setLevel(defaultLevel);
        userLevel.setXp(defaultXp);
        userLevel.setXpThreshold(threshold);
        userLevel.setUser(user);
        userLevel.setMax(false);
        userLevel.setObjective(objective);
        userLevel.setCreatedAt(OffsetDateTime.now());

        return userLevel;
    }
}