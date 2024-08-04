package inc.plab.bpmn.service;

import inc.plab.bpmn.delegate.service.DeleteScenarioDelegate;
import inc.plab.bpmn.delegate.service.DeployScenarioDelegate;
import inc.plab.bpmn.dto.DeployScenarioResponseDto;
import inc.plab.bpmn.model.scenario.Scenario;
import inc.plab.bpmn.model.scenario.ScenarioRepository;
import inc.plab.bpmn.model.user.Profile;
import lombok.RequiredArgsConstructor;
import lombok.SneakyThrows;
import org.camunda.bpm.engine.repository.Deployment;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.UUID;

@RequiredArgsConstructor
@Service
public class ScenarioService {

    private final ScenarioRepository scenarioRepository;
    private final DeleteScenarioDelegate deleteScenarioDelegate;
    private final DeployScenarioDelegate deployScenarioDelegate;

    @SneakyThrows
    public DeployScenarioResponseDto deployScenario(UUID scenarioId, Profile profile) {
        Optional<Scenario> scenarioOptional = scenarioRepository.findByIdAndUser_Id(scenarioId, profile.getId());

        if (scenarioOptional.isEmpty()) {
            throw new Exception("No scenario found to id: " + scenarioId);
        }

        Deployment scenarioDeployment = deployScenarioDelegate.deploy(scenarioOptional.get(), profile);

        DeployScenarioResponseDto deployScenarioResponseDto = new DeployScenarioResponseDto();
        deployScenarioResponseDto.setDeploymentName(scenarioDeployment.getName());

        return deployScenarioResponseDto;
    }

    @SneakyThrows
    public void deleteScenario(UUID scenarioId, Profile profile) {

        Optional<Scenario> scenarioOptional = scenarioRepository.findByIdAndUser_Id(scenarioId, profile.getId());

        if (scenarioOptional.isEmpty()) {
            throw new Exception("No scenario found to id: " + scenarioId);
        }

        deleteScenarioDelegate.deleteScenario(scenarioOptional.get());

    }
}