package inc.plab.bpmn.controller;

import inc.plab.bpmn.model.diagram.BpmnDiagram;
import inc.plab.bpmn.service.DiagramService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/bpmn/diagram")
public class DiagramController {

    private final DiagramService diagramService;

    public DiagramController(DiagramService diagramService) {
        this.diagramService = diagramService;
    }

    @PostMapping("/persist")
    public ResponseEntity<String> persistBpmn(
            @RequestParam("file") MultipartFile file) {
        try {
            Optional<BpmnDiagram> bpmnDiagram = diagramService.persistBpmn(file);

            return bpmnDiagram.map(diagram -> ResponseEntity.ok("BPMN Diagram saved successfully with id: " + diagram.getId()))
                    .orElseGet(() -> ResponseEntity.status(400).body("No valid BPMN Diagram provided"));

        } catch (IOException e) {
            return ResponseEntity.status(500).body("Failed to save BPMN Diagram: " + e.getMessage());
        }
    }

    @PutMapping("/update/{diagramId}")
    public ResponseEntity<String> updateBpmn(
            @PathVariable("diagramId") UUID diagramId,
            @RequestParam("file") MultipartFile file) {
        try {
            Optional<BpmnDiagram> bpmnDiagram = diagramService.updateBpmn(diagramId, file);

            return bpmnDiagram.map(diagram -> ResponseEntity.ok("BPMN Diagram updated successfully with id: " + diagram.getId()))
                    .orElseGet(() -> ResponseEntity.status(400).body("No valid BPMN Diagram provided or diagram does not exist"));

        } catch (IOException e) {
            return ResponseEntity.status(500).body("Failed to update BPMN Diagram: " + e.getMessage());
        }
    }

    @PostMapping("/deploy/{diagramId}")
    public ResponseEntity<String> deployBpmn(
            @PathVariable("diagramId") UUID diagramId) {
        Optional<UUID> deploymentId = diagramService.deployBpmn(diagramId);
        return deploymentId.map(uuid -> ResponseEntity.ok("Deployment successful: " + uuid))
                .orElseGet(() -> ResponseEntity.status(400).body("BPMN Diagram not found and/or Deployment failed"));
    }
}
