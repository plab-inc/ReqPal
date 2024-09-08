package inc.plab.bpmn.service.gamification;

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
        Optional<Objective> objectiveOptional = objectiveRepository.findById(UUID.fromString(objectiveId));
        Objective objective = objectiveOptional.orElseThrow(() -> new IllegalArgumentException("Objective not found"));

        addLogEntry(receivedXp, "Objective: " + objective.getName(), userId);
    }

    public void addLogEntryForFinishedScenario(int receivedXp, String userId) {
        addLogEntry(receivedXp, "Scenario Completed", userId);
    }

    public void addLogEntryForAllLessonObjectives(int receivedXp, String userId) {
        addLogEntry(receivedXp, "All Lesson Objectives", userId);
    }

    public void addLogEntryForAchievement(int receivedXp, String achievementId, String userId) {
        Optional<Achievement> achievementOptional = achievementRepository.findById(UUID.fromString(achievementId));
        Achievement achievement = achievementOptional.orElseThrow(() -> new IllegalArgumentException("Achievement not found"));

        addLogEntry(receivedXp, "Achievement: " + achievement.getTitle(), userId);
    }

    private void addLogEntry(int receivedXp, String text, String userId) {
        UUID userUUID = UUID.fromString(userId);

        Optional<Profile> profileOptional = profileRepository.findById(userUUID);
        Profile profile = profileOptional.orElseThrow(() -> new IllegalArgumentException("Profile not found"));

        XpActivityLog xpActivityLog = new XpActivityLog();
        xpActivityLog.setReceivedXp(receivedXp);
        xpActivityLog.setCreatedAt(OffsetDateTime.now());
        xpActivityLog.setUser(profile);

        xpActivityLog.setAction(text);
        xpActivityLogRepository.save(xpActivityLog);
    }
}