package inc.plab.bpmn.service;

import inc.plab.bpmn.model.diagram.BpmnDiagram;
import inc.plab.bpmn.model.diagram.BpmnDiagramRepository;
import inc.plab.bpmn.model.supabase.SupabaseUser;
import inc.plab.bpmn.model.user.Profile;
import lombok.RequiredArgsConstructor;
import lombok.SneakyThrows;
import org.camunda.bpm.engine.RepositoryService;
import org.camunda.bpm.engine.RuntimeService;
import org.camunda.bpm.engine.repository.Deployment;
import org.camunda.bpm.engine.repository.ProcessDefinition;
import org.camunda.bpm.model.bpmn.Bpmn;
import org.camunda.bpm.model.bpmn.BpmnModelInstance;
import org.camunda.bpm.model.bpmn.instance.Process;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.w3c.dom.Document;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;
import org.xml.sax.SAXException;

import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.parsers.ParserConfigurationException;
import javax.xml.xpath.*;
import java.io.*;
import java.nio.charset.StandardCharsets;
import java.util.*;
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

        try (InputStream inputStream = file.getInputStream()) {
            BpmnModelInstance modelInstance = Bpmn.readModelFromStream(inputStream);

            String processId = extractProcessIdFromModel(modelInstance);
            String xmlContent = getXMLFromModel(modelInstance);

            BpmnDiagram bpmnDiagram = new BpmnDiagram();
            bpmnDiagram.setName(file.getOriginalFilename());
            bpmnDiagram.setVersion(1);
            bpmnDiagram.setProcessDefinitionKey(processId);
            bpmnDiagram.setUser(user.getProfile());
            bpmnDiagram.setXmlContent(xmlContent);

            bpmnDiagramRepository.save(bpmnDiagram);

            return Optional.of(bpmnDiagram);
        }
    }

    public Optional<BpmnDiagram> updateBpmn(UUID diagramId, MultipartFile file) throws IOException {
        Optional<BpmnDiagram> bpmnDiagramOptional = bpmnDiagramRepository.findById(diagramId);

        if (file == null || file.isEmpty()) {
            return Optional.empty();
        }

        if (bpmnDiagramOptional.isEmpty()) {
            return bpmnDiagramOptional;
        }

        try (InputStream inputStream = file.getInputStream()) {
            BpmnModelInstance modelInstance = Bpmn.readModelFromStream(inputStream);
            ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
            String processId = extractProcessIdFromModel(modelInstance);
            BpmnDiagram bpmnDiagram = bpmnDiagramOptional.get();

            if(!Objects.equals(processId, bpmnDiagram.getProcessDefinitionKey())){
                throw new IllegalArgumentException("Process-IDs are not identical");
            }

            String xmlContent = getXMLFromModel(modelInstance);
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