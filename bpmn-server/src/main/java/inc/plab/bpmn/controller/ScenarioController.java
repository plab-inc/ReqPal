package inc.plab.bpmn.controller;

import inc.plab.bpmn.model.supabase.SupabaseUser;
import inc.plab.bpmn.service.ScenarioService;
import io.github.resilience4j.ratelimiter.RequestNotPermitted;
import io.github.resilience4j.ratelimiter.annotation.RateLimiter;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;
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
    public ResponseEntity<String> deployScenario(
            @PathVariable("scenarioId") UUID scenarioId, @AuthenticationPrincipal SupabaseUser user) {
        Optional<String> deploymentNameOptional = scenarioService.deploy(scenarioId, user.getProfile());
        return deploymentNameOptional.map(deploymentName -> ResponseEntity.ok("Deployment successful: " + deploymentName))
                .orElseGet(() -> ResponseEntity.status(400).body("Deployment failed."));
    }

    @RateLimiter(name = "rateLimiterBpmn")
    @PostMapping("/delete/{scenarioId}")
    public ResponseEntity<String> deleteScenario(
            @PathVariable("scenarioId") UUID scenarioId, @AuthenticationPrincipal SupabaseUser user) {
        Optional<String> deletedScenarioIdOptional = scenarioService.delete(scenarioId, user.getProfile());
        return deletedScenarioIdOptional.map(deletedScenarioId -> ResponseEntity.ok("Deleted scenario successful: " + deletedScenarioId))
                .orElseGet(() -> ResponseEntity.status(400).body("Scenario not deleted."));
    }


    @ExceptionHandler({RequestNotPermitted.class})
    @ResponseStatus(HttpStatus.TOO_MANY_REQUESTS)
    public void handleRequestNotPermitted() {
    }
}
