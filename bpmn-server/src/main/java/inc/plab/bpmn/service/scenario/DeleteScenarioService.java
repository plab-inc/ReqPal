package inc.plab.bpmn.service.scenario;

import inc.plab.bpmn.model.scenario.Scenario;
import inc.plab.bpmn.model.scenario.ScenarioRepository;
import inc.plab.bpmn.service.aws.BucketService;
import lombok.RequiredArgsConstructor;
import lombok.SneakyThrows;
import org.camunda.bpm.engine.RepositoryService;
import org.camunda.bpm.engine.RuntimeService;
import org.springframework.stereotype.Component;

import static inc.plab.bpmn.service.scenario.DeployScenarioService.cleanUpDeploymentsToScenario;


@Component
@RequiredArgsConstructor
public class DeleteScenarioService {

    private final ScenarioRepository scenarioRepository;
    private final BucketService bucketService;
    private final RepositoryService repositoryService;
    private final RuntimeService runtimeService;

    @SneakyThrows
    public void deleteScenario(Scenario scenario) {

        bucketService.deleteObjectFromBucket("bpmn", scenario.getBpmnPath());
        bucketService.deleteObjectFromBucket("bpmn", scenario.getSvgPath());

        if (scenario.getDeployed()) {
            cleanUpAllDeploymentsToScenario(scenario);
        }

        scenarioRepository.delete(scenario);
    }

    private void cleanUpAllDeploymentsToScenario(Scenario scenario) {
        cleanUpDeploymentsToScenario(repositoryService, runtimeService, String.valueOf(scenario.getId()), null, true);
    }

}
