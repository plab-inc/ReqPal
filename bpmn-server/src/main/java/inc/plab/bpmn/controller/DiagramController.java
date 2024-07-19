package inc.plab.bpmn.controller;

import inc.plab.bpmn.model.supabase.SupabaseUser;
import inc.plab.bpmn.service.DiagramService;
import io.github.resilience4j.ratelimiter.RequestNotPermitted;
import io.github.resilience4j.ratelimiter.annotation.RateLimiter;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/bpmn/diagram")
public class DiagramController {

    private final DiagramService diagramService;

    public DiagramController(DiagramService diagramService) {
        this.diagramService = diagramService;
    }

    @RateLimiter(name = "rateLimiterBpmn")
    @PostMapping("/deploy/{diagramId}")
    public ResponseEntity<String> deployBpmn(
            @PathVariable("diagramId") UUID diagramId, @AuthenticationPrincipal SupabaseUser user) {
        Optional<UUID> deploymentId = diagramService.deployBpmn(diagramId, user.getProfile());
        return deploymentId.map(uuid -> ResponseEntity.ok("Deployment successful: " + uuid))
                .orElseGet(() -> ResponseEntity.status(400).body("BPMN Diagram not found and/or Deployment failed"));
    }

    @ExceptionHandler({RequestNotPermitted.class})
    @ResponseStatus(HttpStatus.TOO_MANY_REQUESTS)
    public void handleRequestNotPermitted() {
    }
}
