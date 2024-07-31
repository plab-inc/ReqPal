package inc.plab.bpmn.delegate.service;

import inc.plab.bpmn.model.scenario.Scenario;
import inc.plab.bpmn.model.scenario.ScenarioRepository;
import inc.plab.bpmn.service.BucketService;
import lombok.RequiredArgsConstructor;
import lombok.SneakyThrows;
import org.camunda.bpm.engine.RepositoryService;
import org.camunda.bpm.engine.RuntimeService;
import org.springframework.stereotype.Component;

import static inc.plab.bpmn.delegate.service.DeployScenarioDelegate.cleanUpDeploymentsToScenario;


@Component
@RequiredArgsConstructor
public class DeleteScenarioDelegate {

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
