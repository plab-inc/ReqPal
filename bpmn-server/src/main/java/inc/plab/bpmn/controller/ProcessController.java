package inc.plab.bpmn.controller;

import inc.plab.bpmn.service.ProcessService;
import org.camunda.bpm.engine.runtime.ProcessInstance;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/bpmn/process")
public class ProcessController {

    private final ProcessService processService;

    public ProcessController(ProcessService processService) {
        this.processService = processService;
    }

    @PostMapping("/start/{processDefinitionKey}")
    public ResponseEntity<String> startWorkflow(
            @PathVariable("processDefinitionKey") String processDefinitionKey,
            @RequestHeader("studentId") String studentId) {
        try {
            ProcessInstance processInstance = processService.startWorkflow(processDefinitionKey, studentId);
            return ResponseEntity.ok("ProcessInstance started with processInstanceId: " + processInstance.getId());
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Failed to start workflow: " + e.getMessage());
        }
    }

    @PostMapping("/invoke/{taskId}")
    public ResponseEntity<String> invokeItem(
            @PathVariable("taskId") String taskId,
            @RequestHeader("studentId") String studentId,
            @RequestBody String lessonResults) {
        try {
            processService.invokeItem(taskId, studentId, lessonResults);
            return ResponseEntity.ok("Task completed: " + taskId);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error completing task: " + e.getMessage());
        }
    }

    @GetMapping(value = "/status/{processInstanceId}", produces = "application/json")
    public ResponseEntity<String> getProcessInstanceStatus(
            @PathVariable("processInstanceId") String processInstanceId,
            @RequestHeader("studentId") String studentId) throws Exception {

        String responseJson = processService.getProcessInstanceStatus(processInstanceId, studentId);
        return ResponseEntity.ok(responseJson);

    }
}