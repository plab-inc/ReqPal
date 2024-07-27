package inc.plab.bpmn.controller;

import inc.plab.bpmn.dto.BpmnResponseDto;
import inc.plab.bpmn.dto.ExceptionResponseDto;
import inc.plab.bpmn.dto.InvokeLessonUserTaskResponseDto;
import inc.plab.bpmn.dto.WorkflowResponseDto;
import inc.plab.bpmn.model.supabase.SupabaseUser;
import inc.plab.bpmn.service.ProcessService;
import io.github.resilience4j.ratelimiter.RequestNotPermitted;
import io.github.resilience4j.ratelimiter.annotation.RateLimiter;
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
    public ResponseEntity<BpmnResponseDto<?>> startWorkflow(
            @PathVariable("scenarioId") String scenarioId,
            @AuthenticationPrincipal SupabaseUser user) {
        try {
            WorkflowResponseDto response = processService.startWorkflowForScenario(scenarioId, String.valueOf(user.getId()));
            response.setStatus("success");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            ExceptionResponseDto<String> errorResponse = new ExceptionResponseDto<>();
            errorResponse.setStatus("error");
            errorResponse.setDescription("Failed to start workflow: " + e.getMessage());
            return ResponseEntity.status(400).body(errorResponse);
        }
    }

    @RateLimiter(name = "rateLimiterBpmn")
    @PostMapping("/invoke/{scenarioId}")
    public ResponseEntity<BpmnResponseDto<?>> invokeItem(
            @PathVariable("scenarioId") String scenarioId,
            @AuthenticationPrincipal SupabaseUser user,
            @RequestBody String lessonResults) {
        try {
            String processDefinitionKey = "Process_" + scenarioId;
            InvokeLessonUserTaskResponseDto response = processService.invokeItem(processDefinitionKey, String.valueOf(user.getId()), lessonResults);
            response.setStatus("success");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            ExceptionResponseDto<String> errorResponse = new ExceptionResponseDto<>();
            errorResponse.setStatus("error");
            errorResponse.setDescription("Error completing task: " + e.getMessage());
            return ResponseEntity.status(400).body(errorResponse);
        }
    }

    @ExceptionHandler({RequestNotPermitted.class})
    @ResponseStatus(HttpStatus.TOO_MANY_REQUESTS)
    public void handleRequestNotPermitted() {
    }
}