package inc.plab.bpmn.controller;

import inc.plab.bpmn.dto.DeployScenarioResponseDto;
import inc.plab.bpmn.model.supabase.SupabaseUser;
import inc.plab.bpmn.service.scenario.ScenarioService;
import io.github.resilience4j.ratelimiter.RequestNotPermitted;
import io.github.resilience4j.ratelimiter.annotation.RateLimiter;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/bpmn/scenario")
public class ScenarioController {

    private final ScenarioService scenarioService;

    public ScenarioController(ScenarioService scenarioService) {
        this.scenarioService = scenarioService;
    }

    @RateLimiter(name = "rateLimiterBpmn")
    @PostMapping("/deploy/{scenarioId}")
    public ResponseEntity<DeployScenarioResponseDto> deployScenario(@PathVariable("scenarioId") UUID scenarioId, @AuthenticationPrincipal SupabaseUser user) {
        DeployScenarioResponseDto response = scenarioService.deployScenario(scenarioId, user.getProfile());
        return ResponseEntity.ok(response);
    }

    @RateLimiter(name = "rateLimiterBpmn")
    @PostMapping("/delete/{scenarioId}")
    public ResponseEntity<String> deleteScenario(@PathVariable("scenarioId") UUID scenarioId, @AuthenticationPrincipal SupabaseUser user) {
        scenarioService.deleteScenario(scenarioId, user.getProfile());
        return ResponseEntity.noContent().build();
    }

    @ExceptionHandler({RequestNotPermitted.class})
    @ResponseStatus(HttpStatus.TOO_MANY_REQUESTS)
    public void handleRequestNotPermitted() {
    }
}
