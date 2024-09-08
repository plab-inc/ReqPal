package inc.plab.bpmn.service.scenario;

import inc.plab.bpmn.model.scenario.Scenario;
import inc.plab.bpmn.model.scenario.ScenarioRepository;
import inc.plab.bpmn.service.aws.BucketService;
import lombok.RequiredArgsConstructor;
import lombok.SneakyThrows;
import org.camunda.bpm.engine.RepositoryService;
import org.camunda.bpm.engine.RuntimeService;
import org.camunda.bpm.engine.repository.Deployment;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Objects;


@Component
@RequiredArgsConstructor
public class DeployScenarioService {

    private final RuntimeService runtimeService;
    private final RepositoryService repositoryService;
    private final ScenarioRepository scenarioRepository;
    private final BucketService bucketService;

    @SneakyThrows
    public Deployment deploy(Scenario scenario) {

        Deployment deployment = repositoryService.createDeployment()
                .addInputStream(scenario.getId() + ".bpmn", bucketService.getObjectStreamFromBucket("bpmn", scenario.getBpmnPath()))
                .tenantId(String.valueOf(scenario.getUser().getId()))
                .name(String.valueOf(scenario.getId()))
                .source("ReqPal-BPMN-Sever")
                .enableDuplicateFiltering(true)
                .deploy();

        cleanUpFormerDeploymentsToScenario(scenario, deployment.getId());


        scenario.setEdited(false);
        if (scenario.getDeployed()) {
            scenario.setVersion(scenario.getVersion() + 1);
        }
        scenario.setDeployed(true);
        scenarioRepository.save(scenario);

        return deployment;
    }

    private void cleanUpFormerDeploymentsToScenario(Scenario scenario, String newDeploymentId) {
        cleanUpDeploymentsToScenario(this.repositoryService, this.runtimeService, String.valueOf(scenario.getId()), newDeploymentId, false);
    }

    @SneakyThrows
    public static void cleanUpDeploymentsToScenario(RepositoryService repositoryService, RuntimeService runtimeService, String deploymentName, String newDeploymentId, Boolean allDeployments) {
        List<Deployment> deployments = repositoryService.createDeploymentQuery().deploymentName(deploymentName).unlimitedList();

        for (Deployment deployment : deployments) {
            long processInstanceCount = runtimeService.createProcessInstanceQuery()
                    .deploymentId(deployment.getId())
                    .count();

            if (allDeployments || processInstanceCount == 0 && !Objects.equals(deployment.getId(), newDeploymentId)) {
                repositoryService.deleteDeployment(deployment.getId(), true, true);
            }

        }
    }
}
