package inc.plab.bpmn.service;

import inc.plab.bpmn.model.achievement.Achievement;
import inc.plab.bpmn.model.achievement.AchievementRepository;
import inc.plab.bpmn.model.activityLog.XpActivityLog;
import inc.plab.bpmn.model.activityLog.XpActivityLogRepository;
import inc.plab.bpmn.model.objective.Objective;
import inc.plab.bpmn.model.objective.ObjectiveRepository;
import inc.plab.bpmn.model.user.Profile;
import inc.plab.bpmn.model.user.ProfileRepository;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.OffsetDateTime;
import java.util.Optional;
import java.util.UUID;

@Service
@Transactional
@AllArgsConstructor
public class ActivityLogService {

    private final XpActivityLogRepository xpActivityLogRepository;
    private final ProfileRepository profileRepository;
    private final ObjectiveRepository objectiveRepository;
    private final AchievementRepository achievementRepository;

    public void addLogEntryForObjective(int receivedXp, String objectiveId, String userId) {
        UUID userUUID = UUID.fromString(userId);

        Optional<Profile> profileOptional = profileRepository.findById(userUUID);
        Profile profile = profileOptional.orElseThrow(() -> new IllegalArgumentException("Profile not found"));

        Optional<Objective> objectiveOptional = objectiveRepository.findById(UUID.fromString(objectiveId));
        Objective objective = objectiveOptional.orElseThrow(() -> new IllegalArgumentException("Objective not found"));

        XpActivityLog xpActivityLog = new XpActivityLog();
        xpActivityLog.setReceivedXp(receivedXp);
        xpActivityLog.setCreatedAt(OffsetDateTime.now());
        xpActivityLog.setUser(profile);
        xpActivityLog.setAction("Lernziel: " + objective.getName());

        xpActivityLogRepository.save(xpActivityLog);
    }

    public void addLogEntryForAchievement(int receivedXp, String achievementId, String userId) {
        UUID userUUID = UUID.fromString(userId);

        Optional<Profile> profileOptional = profileRepository.findById(userUUID);
        Profile profile = profileOptional.orElseThrow(() -> new IllegalArgumentException("Profile not found"));

        Optional<Achievement> achievementOptional = achievementRepository.findById(UUID.fromString(achievementId));
        Achievement achievement = achievementOptional.orElseThrow(() -> new IllegalArgumentException("Achievement not found"));

        XpActivityLog xpActivityLog = new XpActivityLog();
        xpActivityLog.setReceivedXp(receivedXp);
        xpActivityLog.setCreatedAt(OffsetDateTime.now());
        xpActivityLog.setUser(profile);
        xpActivityLog.setAction("Achievement: " + achievement.getTitle());

        xpActivityLogRepository.save(xpActivityLog);
    }
}