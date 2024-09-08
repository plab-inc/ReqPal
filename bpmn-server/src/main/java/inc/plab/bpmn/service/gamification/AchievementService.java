package inc.plab.bpmn.service.gamification;

import inc.plab.bpmn.model.achievement.Achievement;
import inc.plab.bpmn.model.achievement.AchievementRepository;
import inc.plab.bpmn.model.user.Profile;
import inc.plab.bpmn.model.user.ProfileRepository;
import inc.plab.bpmn.model.user.UserAchievement;
import inc.plab.bpmn.model.user.UserAchievementRepository;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.OffsetDateTime;
import java.util.Optional;
import java.util.UUID;

@Service
@Transactional
@AllArgsConstructor
public class AchievementService {

    private final AchievementRepository achievementRepository;
    private final UserAchievementRepository userAchievementRepository;
    private final ProfileRepository profileRepository;

    public void addAchievementToUser(String achievementId, String userId) {
        UUID userUUID = UUID.fromString(userId);
        UUID achievementUUID = UUID.fromString(achievementId);

        Optional<Profile> profileOptional = profileRepository.findById(userUUID);
        Profile profile = profileOptional.orElseThrow(() -> new IllegalArgumentException("Profile not found"));

        Optional<Achievement> achievementOptional = achievementRepository.findById(achievementUUID);
        Achievement achievement = achievementOptional.orElseThrow(() -> new IllegalArgumentException("Achievement not found"));

        Optional<UserAchievement> userAchievementOptional = userAchievementRepository.findByUserIdAndAchievementId(userUUID, achievementUUID);
        UserAchievement userAchievement;

        if (userAchievementOptional.isPresent()) {
            userAchievement = userAchievementOptional.get();
            Integer amount = userAchievement.getAmount();
            userAchievement.setAmount(++amount);
        } else {
            userAchievement = new UserAchievement();
            userAchievement.setAchievement(achievement);
            userAchievement.setUser(profile);
            userAchievement.setAmount(1);
            userAchievement.setCreatedAt(OffsetDateTime.now());
        }
        userAchievementRepository.save(userAchievement);
    }
}