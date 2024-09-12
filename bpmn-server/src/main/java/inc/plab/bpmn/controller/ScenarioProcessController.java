package inc.plab.bpmn.controller;

import inc.plab.bpmn.dto.InvokeLessonUserTaskResponseDto;
import inc.plab.bpmn.dto.StartWorkflowResponseDto;
import inc.plab.bpmn.model.supabase.SupabaseUser;
import inc.plab.bpmn.service.scenario.ScenarioProcessService;
import io.github.resilience4j.ratelimiter.RequestNotPermitted;
import io.github.resilience4j.ratelimiter.annotation.RateLimiter;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/bpmn/process")
public class ScenarioProcessController {

    private final ScenarioProcessService scenarioProcessService;

    public ScenarioProcessController(ScenarioProcessService scenarioProcessService) {
        this.scenarioProcessService = scenarioProcessService;
    }

    @RateLimiter(name = "rateLimiterBpmn")
    @PostMapping("/start/{scenarioId}")
    public ResponseEntity<StartWorkflowResponseDto> startWorkflow(@PathVariable("scenarioId") String scenarioId, @AuthenticationPrincipal SupabaseUser user) {
        StartWorkflowResponseDto response = scenarioProcessService.startWorkflowForScenario(scenarioId, String.valueOf(user.getId()), String.valueOf(user.getProfile().getTeacher().getId()));
            return ResponseEntity.ok(response);
    }

    @RateLimiter(name = "rateLimiterBpmn")
    @PostMapping("/invoke/{scenarioId}")
    public ResponseEntity<InvokeLessonUserTaskResponseDto> invokeItem(@PathVariable("scenarioId") String scenarioId, @AuthenticationPrincipal SupabaseUser user, @RequestBody String lessonResults) {
        InvokeLessonUserTaskResponseDto response = scenarioProcessService.invokeItem(scenarioId, String.valueOf(user.getId()), String.valueOf(user.getProfile().getTeacher().getId()), lessonResults);
            return ResponseEntity.ok(response);
    }

    @ExceptionHandler(RequestNotPermitted.class)
    @ResponseStatus(HttpStatus.TOO_MANY_REQUESTS)
    public void handleRequestNotPermitted() {
    }
}