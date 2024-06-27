package inc.plab.bpmn.controller;

import inc.plab.bpmn.model.BpmnDiagram;
import inc.plab.bpmn.model.BpmnDiagramRepository;
import org.camunda.bpm.engine.RepositoryService;
import org.camunda.bpm.engine.RuntimeService;
import org.camunda.bpm.engine.TaskService;
import org.camunda.bpm.engine.repository.Deployment;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
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

@RestController
@RequestMapping("/bpmn/diagram")
public class DiagramController {

    private final RuntimeService runtimeService;
    private final RepositoryService repositoryService;
    private final BpmnDiagramRepository bpmnDiagramRepository;

    public DiagramController(RuntimeService runtimeService, TaskService taskService, RepositoryService repositoryService, BpmnDiagramRepository bpmnDiagramRepository) {
        this.runtimeService = runtimeService;
        this.repositoryService = repositoryService;
        this.bpmnDiagramRepository = bpmnDiagramRepository;
    }

    @PostMapping("/persist")
    public ResponseEntity<String> persistBpmn(@RequestParam("file") MultipartFile file) {
        try (BufferedReader reader = new BufferedReader(new InputStreamReader(file.getInputStream(), StandardCharsets.UTF_8))) {
            String xmlContent = reader.lines().collect(Collectors.joining("\n"));

            BpmnDiagram bpmnDiagram = new BpmnDiagram();
            bpmnDiagram.setName(file.getOriginalFilename());
            bpmnDiagram.setXmlContent(xmlContent);
            bpmnDiagram.setVersion(1);
            bpmnDiagramRepository.save(bpmnDiagram);

            return ResponseEntity.ok("BPMN Diagram saved successfully with id: " + bpmnDiagram.getId());
        } catch (IOException e) {
            return ResponseEntity.status(500).body("Failed to save BPMN Diagram: " + e.getMessage());
        }
    }

    @PutMapping("/update/{diagramId}")
    public ResponseEntity<String> updateBpmn(
            @PathVariable("diagramId") UUID diagramId,
            @RequestParam("file") MultipartFile file) {
        Optional<BpmnDiagram> bpmnDiagramOptional = bpmnDiagramRepository.findById(diagramId);

        if (bpmnDiagramOptional.isEmpty()) {
            return ResponseEntity.status(404).body("BPMN Diagram not found: " + diagramId);
        }

        try (BufferedReader reader = new BufferedReader(new InputStreamReader(file.getInputStream(), StandardCharsets.UTF_8))) {
            String xmlContent = reader.lines().collect(Collectors.joining("\n"));

            BpmnDiagram bpmnDiagram = bpmnDiagramOptional.get();
            bpmnDiagram.setXmlContent(xmlContent);
            bpmnDiagram.setVersion(bpmnDiagram.getVersion() + 1);
            bpmnDiagramRepository.save(bpmnDiagram);

            return ResponseEntity.ok("BPMN Diagram of id:" + bpmnDiagram.getId() + " updated successfully");
        } catch (IOException e) {
            return ResponseEntity.status(500).body("Failed to update BPMN Diagram: " + e.getMessage());
        }
    }

    @PostMapping("/deploy/{diagramId}")
    public ResponseEntity<String> deployBpmn(
            @PathVariable("diagramId") UUID diagramId) {
        Optional<BpmnDiagram> bpmnDiagramOptional = bpmnDiagramRepository.findById(diagramId);

        if (bpmnDiagramOptional.isEmpty()) {
            return ResponseEntity.status(404).body("BPMN Diagram not found: " + diagramId);
        }

        BpmnDiagram bpmnDiagram = bpmnDiagramOptional.get();
        Deployment deployment;

        try {
            deployment = repositoryService.createDeployment()
                    .addString(bpmnDiagram.getName(), bpmnDiagram.getXmlContent())
                    .name(bpmnDiagram.getName())
                    .deploy();
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Deployment failed: " + e.getMessage());
        }

        bpmnDiagramRepository.save(bpmnDiagram);
        cleanUpOldDeployments(deployment.getName(), deployment.getId());

        return ResponseEntity.ok("Deployment successful: " + deployment.getId());
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
