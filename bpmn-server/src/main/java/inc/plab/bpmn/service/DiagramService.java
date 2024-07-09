package inc.plab.bpmn.service;

import inc.plab.bpmn.model.diagram.BpmnDiagram;
import inc.plab.bpmn.model.diagram.BpmnDiagramRepository;
import inc.plab.bpmn.model.supabase.SupabaseUser;
import inc.plab.bpmn.model.user.Profile;
import lombok.RequiredArgsConstructor;
import org.camunda.bpm.engine.RepositoryService;
import org.camunda.bpm.engine.RuntimeService;
import org.camunda.bpm.engine.repository.Deployment;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@RequiredArgsConstructor
@Service
public class DiagramService {

    private final RuntimeService runtimeService;
    private final RepositoryService repositoryService;
    private final BpmnDiagramRepository bpmnDiagramRepository;
    private static final Logger logger = LoggerFactory.getLogger(DiagramService.class);

    public Optional<BpmnDiagram> persistBpmn(MultipartFile file, SupabaseUser user) throws IOException {
        if (file == null || file.isEmpty()) {
            return Optional.empty();
        }

        try (BufferedReader reader = new BufferedReader(new InputStreamReader(file.getInputStream(), StandardCharsets.UTF_8))) {
            String xmlContent = reader.lines().collect(Collectors.joining("\n"));

            BpmnDiagram bpmnDiagram = new BpmnDiagram();
            bpmnDiagram.setName(file.getOriginalFilename());
            bpmnDiagram.setXmlContent(xmlContent);
            bpmnDiagram.setVersion(1);
            bpmnDiagram.setUser(user.getProfile());
            bpmnDiagramRepository.save(bpmnDiagram);

            return Optional.of(bpmnDiagram);

        }
    }

    public Optional<BpmnDiagram> updateBpmn(UUID diagramId, MultipartFile file) throws IOException {
        Optional<BpmnDiagram> bpmnDiagramOptional = bpmnDiagramRepository.findById(diagramId);

        if (bpmnDiagramOptional.isEmpty()) {
            return bpmnDiagramOptional;
        }

        try (BufferedReader reader = new BufferedReader(new InputStreamReader(file.getInputStream(), StandardCharsets.UTF_8))) {
            String xmlContent = reader.lines().collect(Collectors.joining("\n"));

            BpmnDiagram bpmnDiagram = bpmnDiagramOptional.get();
            bpmnDiagram.setXmlContent(xmlContent);
            bpmnDiagram.setVersion(bpmnDiagram.getVersion() + 1);
            bpmnDiagramRepository.save(bpmnDiagram);

            return bpmnDiagramOptional;
        }
    }

    public Optional<UUID> deployBpmn(UUID diagramId, Profile profile) {
        Optional<BpmnDiagram> bpmnDiagramOptional = bpmnDiagramRepository.findById(diagramId);

        if (bpmnDiagramOptional.isEmpty()) {
            return Optional.empty();
        }

        BpmnDiagram bpmnDiagram = bpmnDiagramOptional.get();
        Deployment deployment;

        try {
            deployment = repositoryService.createDeployment()
                    .addString(bpmnDiagram.getName(), bpmnDiagram.getXmlContent())
                    .name(profile.getUsername() + "_" + bpmnDiagram.getId())
                    .tenantId(String.valueOf(profile.getId()))
                    .source("ReqPal BPMN-Sever")
                    .enableDuplicateFiltering(true)
                    .deploy();
        } catch (Exception e) {
            logger.error("Deployment for diagram {} failed", diagramId);
            return Optional.empty();
        }

        cleanUpOldDeployments(deployment.getName(), deployment.getId());

        return Optional.of(UUID.fromString(deployment.getId()));
    }

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
}