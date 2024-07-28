package inc.plab.bpmn.service;

import inc.plab.bpmn.model.scenario.Scenario;
import inc.plab.bpmn.model.scenario.ScenarioRepository;
import inc.plab.bpmn.model.user.Profile;
import lombok.RequiredArgsConstructor;
import lombok.SneakyThrows;
import org.camunda.bpm.engine.RepositoryService;
import org.camunda.bpm.engine.RuntimeService;
import org.camunda.bpm.engine.repository.Deployment;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.UUID;

@RequiredArgsConstructor
@Service
public class ScenarioService {

    private final RuntimeService runtimeService;
    private final RepositoryService repositoryService;
    private final ScenarioRepository scenarioRepository;
    private final BucketService bucketService;
    private static final Logger logger = LoggerFactory.getLogger(ScenarioService.class);


    @SneakyThrows
    public Optional<String> deploy(UUID scenarioId, Profile profile) {

        Optional<Scenario> scenarioOptional = scenarioRepository.findByIdAndUser_Id(scenarioId, profile.getId());

        if (scenarioOptional.isEmpty()) {
            logger.error("No scenario found to id: " + scenarioId);
            return Optional.empty();
        }

        Scenario scenario = scenarioOptional.get();

        Deployment deployment = repositoryService.createDeployment()
                .addInputStream(scenario.getId() + ".bpmn", bucketService.getObjectStreamFromBucket("bpmn", scenario.getBpmnPath()))
                .tenantId(String.valueOf(profile.getId()))
                .name(String.valueOf(scenario.getId()))
                .source("ReqPal-BPMN-Sever")
                .enableDuplicateFiltering(true)
                .deploy();

        cleanUpFormerDeploymentsToScenario(scenario, deployment.getId());

        scenario.setDeployed(true);
        scenario.setVersion(scenario.getVersion() + 1);
        scenarioRepository.save(scenario);

        return Optional.of(deployment.getName());
    }

    @SneakyThrows
    public Optional<String> delete(UUID scenarioId, Profile profile) {

        Optional<Scenario> scenarioOptional = scenarioRepository.findByIdAndUser_Id(scenarioId, profile.getId());

        if (scenarioOptional.isEmpty()) {
            logger.error("No scenario found to id: " + scenarioId);
            return Optional.empty();
        }

        Scenario scenario = scenarioOptional.get();

        bucketService.deleteObjectFromBucket("bpmn", scenario.getBpmnPath());
        bucketService.deleteObjectFromBucket("bpmn", scenario.getSvgPath());

        if (scenario.getDeployed()) {
            cleanUpAllDeploymentsToScenario(scenario);
        }

        scenarioRepository.delete(scenario);

        return Optional.of(String.valueOf(scenario.getId()));

    }

    private void cleanUpAllDeploymentsToScenario(Scenario scenario) {
        cleanUpDeploymentsToScenario(String.valueOf(scenario.getId()), null, true);
    }

    private void cleanUpFormerDeploymentsToScenario(Scenario scenario, String newDeploymentId) {
        cleanUpDeploymentsToScenario(String.valueOf(scenario.getId()), newDeploymentId, false);
    }

    @SneakyThrows
    private void cleanUpDeploymentsToScenario(String deploymentName, String newDeploymentId, Boolean allDeployments) {
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