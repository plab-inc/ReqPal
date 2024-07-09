package inc.plab.bpmn.controller;

import inc.plab.bpmn.model.supabase.SupabaseUser;
import inc.plab.bpmn.service.ProcessService;
import io.github.resilience4j.ratelimiter.RequestNotPermitted;
import io.github.resilience4j.ratelimiter.annotation.RateLimiter;
import org.camunda.bpm.engine.runtime.ProcessInstance;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/bpmn/process")
public class ProcessController {

    private final ProcessService processService;

    public ProcessController(ProcessService processService) {
        this.processService = processService;
    }

    @RateLimiter(name = "rateLimiterBpmn")
    @PostMapping("/start/{processDefinitionKey}")
    public ResponseEntity<String> startWorkflow(
            @PathVariable("processDefinitionKey") String processDefinitionKey,
            @AuthenticationPrincipal SupabaseUser user) {
        try {
            ProcessInstance processInstance = processService.startWorkflow(processDefinitionKey, String.valueOf(user.getId()));
            return ResponseEntity.ok("ProcessInstance started with processInstanceId: " + processInstance.getId());
        } catch (Exception e) {
            return ResponseEntity.status(400).body("Failed to start workflow: " + e.getMessage());
        }
    }

    @RateLimiter(name = "rateLimiterBpmn")
    @PostMapping("/invoke/{taskId}")
    public ResponseEntity<String> invokeItem(
            @PathVariable("taskId") String taskId,
            @AuthenticationPrincipal SupabaseUser user,
            @RequestBody String lessonResults) {
        try {
            processService.invokeItem(taskId, String.valueOf(user.getId()), lessonResults);
            return ResponseEntity.ok("Task completed: " + taskId);
        } catch (Exception e) {
            return ResponseEntity.status(400).body("Error completing task: " + e.getMessage());
        }
    }

    @RateLimiter(name = "rateLimiterBpmn")
    @GetMapping(value = "/status/{processInstanceId}", produces = "application/json")
    public ResponseEntity<String> getProcessInstanceStatus(
            @PathVariable("processInstanceId") String processInstanceId,
            @AuthenticationPrincipal SupabaseUser user) {

        try {
            String responseJson = processService.getProcessInstanceStatus(processInstanceId, String.valueOf(user.getId()));
            return ResponseEntity.ok(responseJson);
        } catch (Exception e) {
            return ResponseEntity.status(400).body("Error completing task: " + e.getMessage());
        }

    }

    @ExceptionHandler({RequestNotPermitted.class})
    @ResponseStatus(HttpStatus.TOO_MANY_REQUESTS)
    public void handleRequestNotPermitted() {
    }
}