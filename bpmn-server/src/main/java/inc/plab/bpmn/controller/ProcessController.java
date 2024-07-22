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
    @PostMapping("/start/{scenarioId}")
    public ResponseEntity<String> startWorkflow(
            @PathVariable("scenarioId") String scenarioId,
            @AuthenticationPrincipal SupabaseUser user) {
        try {
            String processDefinitionKey = "Process_" + scenarioId;
            ProcessInstance processInstance = processService.startWorkflow(processDefinitionKey, String.valueOf(user.getId()));
            return ResponseEntity.ok("ProcessInstance started with processInstanceId: " + processInstance.getId());
        } catch (Exception e) {
            return ResponseEntity.status(400).body("Failed to start workflow: " + e.getMessage());
        }
    }

    @RateLimiter(name = "rateLimiterBpmn")
    @PostMapping("/invoke/{scenarioId}")
    public ResponseEntity<String> invokeItem(
            @PathVariable("scenarioId") String scenarioId,
            @AuthenticationPrincipal SupabaseUser user,
            @RequestBody String lessonResults) {
        try {
            String processDefinitionKey = "Process_" + scenarioId;
            String taskId = processService.invokeItem(processDefinitionKey, String.valueOf(user.getId()), lessonResults);

            if (taskId == null) {
                return ResponseEntity.ok("Scenario completed.");
            }

            return ResponseEntity.ok("Task completed, nextLessonId is: " + taskId);
        } catch (Exception e) {
            return ResponseEntity.status(400).body("Error completing task: " + e.getMessage());
        }
    }

    @RateLimiter(name = "rateLimiterBpmn")
    @GetMapping(value = "/status/{scenarioId}", produces = "application/json")
    public ResponseEntity<String> getProcessInstanceStatus(
            @PathVariable("scenarioId") String scenarioId,
            @AuthenticationPrincipal SupabaseUser user) {

        try {
            String processDefinitionKey = "Process_" + scenarioId;
            String responseJson = processService.getProcessInstanceStatus(processDefinitionKey, String.valueOf(user.getId()));
            return ResponseEntity.ok(responseJson);
        } catch (Exception e) {
            return ResponseEntity.status(400).body(e.getMessage());
        }

    }

    @ExceptionHandler({RequestNotPermitted.class})
    @ResponseStatus(HttpStatus.TOO_MANY_REQUESTS)
    public void handleRequestNotPermitted() {
    }
}