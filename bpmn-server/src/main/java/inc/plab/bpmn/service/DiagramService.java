package inc.plab.bpmn.service;

import  inc.plab.bpmn.aws.BucketService;
import inc.plab.bpmn.model.scenario.Scenario;
import inc.plab.bpmn.model.scenario.ScenarioRepository;
import inc.plab.bpmn.model.user.Profile;
import lombok.RequiredArgsConstructor;
import lombok.SneakyThrows;
import org.camunda.bpm.engine.RepositoryService;
import org.camunda.bpm.engine.RuntimeService;
import org.camunda.bpm.engine.repository.Deployment;
import org.camunda.bpm.model.bpmn.Bpmn;
import org.camunda.bpm.model.bpmn.BpmnModelInstance;
import org.camunda.bpm.model.bpmn.instance.Process;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.UUID;

@RequiredArgsConstructor
@Service
public class DiagramService {

    private final RuntimeService runtimeService;
    private final RepositoryService repositoryService;
    private final ScenarioRepository scenarioRepository;
    private final BucketService bucketService;
    private static final Logger logger = LoggerFactory.getLogger(DiagramService.class);

    @SneakyThrows
    public Optional<UUID> deployBpmn(UUID diagramId, Profile profile) {

        Optional<Scenario> scenarioOptional = scenarioRepository.findById(diagramId);
        InputStream bucketStream = bucketService.getObjectFromBucket("bpmn", scenarioOptional.get().getBpmnPath());

        // TODO Get Diagram from SupabaseStorage

        Deployment deployment;

        try {
            // TODO entfernen sobald wieder es läuft
            deployment = repositoryService.createDeployment()
                    .addInputStream("Test.bpmn", bucketStream)
                    .tenantId(String.valueOf(profile.getId()))
                    .source("ReqPal-BPMN-Sever")
                    .enableDuplicateFiltering(true)
                    .deploy();
        } catch (Exception e) {
            logger.error("Deployment for diagram {} failed", diagramId);
            return Optional.empty();
        }

        //cleanUpOldDeployments(deployment.getName(), deployment.getId());

        return Optional.of(scenarioOptional.get().getId());
    }

    @SneakyThrows
    private void cleanUpOldDeployments(String diagramName, String newDeploymentId) {
        List<Deployment> deployments = repositoryService.createDeploymentQuery().deploymentName(diagramName).unlimitedList();

        for (Deployment deployment : deployments) {
            long processInstanceCount = runtimeService.createProcessInstanceQuery()
                    .deploymentId(deployment.getId())
                    .count();

            if (processInstanceCount == 0 && !Objects.equals(deployment.getId(), newDeploymentId)) {
                repositoryService.deleteDeployment(deployment.getId(), true);
            }
        }
    }

    @SneakyThrows
    private String extractProcessIdFromModel(BpmnModelInstance modelInstance) {
        return Optional.ofNullable(modelInstance.getModelElementsByType(Process.class))
                .filter(processes -> processes.size() == 1)
                .map(processes -> processes.iterator().next().getId())
                .orElseThrow(() -> {
                    if (modelInstance.getModelElementsByType(Process.class).isEmpty()) {
                        return new IllegalArgumentException("Process-ID not found");
                    } else {
                        return new IllegalArgumentException("More than one Process-ID found");
                    }
                });
    }

    @SneakyThrows
    private String getXMLFromModel(BpmnModelInstance modelInstance) {
        return Optional.of(new ByteArrayOutputStream())
                .map(outputStream -> {
                    Bpmn.writeModelToStream(outputStream, modelInstance);
                    return outputStream.toString(StandardCharsets.UTF_8);
                }).orElseThrow(() -> new IOException("Exception while writing the model"));
    }

}