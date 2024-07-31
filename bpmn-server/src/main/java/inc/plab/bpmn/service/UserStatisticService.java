package inc.plab.bpmn.service;

import inc.plab.bpmn.model.user.Profile;
import inc.plab.bpmn.model.user.ProfileRepository;
import inc.plab.bpmn.model.user.UserStatistic;
import inc.plab.bpmn.model.user.UserStatisticRepository;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.OffsetDateTime;
import java.util.Optional;
import java.util.UUID;

@Service
@Transactional
@AllArgsConstructor
public class UserStatisticService {

    private final UserStatisticRepository userStatisticRepository;
    private final ProfileRepository profileRepository;

    public void addToTotalScenarios(int value, String userId) {
        UserStatistic userStatistic = getUserStatistic(userId);
        if (value > 0) {
            Integer currentValue = userStatistic.getTotalScenarios();
            if (currentValue == null) {
                currentValue = 0;
            }
            userStatistic.setTotalScenarios(currentValue + value);
            userStatisticRepository.save(userStatistic);
        }
    }

    public void addToTotalPoints(int value, String userId) {
        UserStatistic userStatistic = getUserStatistic(userId);
        if (value > 0) {
            Integer currentValue = userStatistic.getTotalPoints();
            if (currentValue == null) {
                currentValue = 0;
            }
            userStatistic.setTotalPoints(currentValue + value);
            userStatisticRepository.save(userStatistic);
        }
    }

    public void addToTotalReqPalXp(int value, String userId) {
        UserStatistic userStatistic = getUserStatistic(userId);
        if (value > 0) {
            Integer currentValue = userStatistic.getTotalReqPalXp();
            if (currentValue == null) {
                currentValue = 0;
            }
            userStatistic.setTotalReqPalXp(currentValue + value);
            userStatisticRepository.save(userStatistic);
        }
    }

    public void addToTotalObjectiveXp(int value, String userId) {
        UserStatistic userStatistic = getUserStatistic(userId);
        if (value > 0) {
            Integer currentValue = userStatistic.getTotalObjectiveXp();
            if (currentValue == null) {
                currentValue = 0;
            }
            userStatistic.setTotalObjectiveXp(currentValue + value);
            userStatisticRepository.save(userStatistic);
        }
    }

    private UserStatistic getUserStatistic(String userId) {
        UUID uuid = UUID.fromString(userId);
        Optional<UserStatistic> userStatisticOptional = userStatisticRepository.findByUserId(uuid);
        UserStatistic userStatistic;

        if (userStatisticOptional.isPresent()) {
            userStatistic = userStatisticOptional.get();
        } else {
            userStatistic = new UserStatistic();
            Optional<Profile> profileOptional = profileRepository.findById(uuid);
            if (profileOptional.isPresent()) {
                Profile profile = profileOptional.get();
                userStatistic.setCreatedAt(OffsetDateTime.now());
                userStatistic.setUser(profile);
                userStatistic.setTotalReqPalXp(0);
                userStatistic.setTotalObjectiveXp(0);
                userStatistic.setTotalPoints(0);
                userStatistic.setTotalScenarios(0);
            } else {
                throw new IllegalArgumentException("Profile not found");
            }
        }
        return userStatistic;
    }
}
