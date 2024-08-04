package inc.plab.bpmn.exception;

import inc.plab.bpmn.dto.ExceptionResponseDto;
import org.camunda.bpm.engine.ProcessEngineException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

@ControllerAdvice
@RestController
public class ExceptionResponseHandler extends ResponseEntityExceptionHandler {

    private static final String FORBIDDEN_ERROR_MESSAGE = "Access Denied: You do not have sufficient privileges to access this resource.";
    private static final String SOMETHING_WRONG_MESSAGE = "Something went wrong: ";

    @ExceptionHandler(ResponseStatusException.class)
    public ResponseEntity<ExceptionResponseDto> responseStatusExceptionHandler(final ResponseStatusException exception) {
        final var exceptionResponse = new ExceptionResponseDto();
        exceptionResponse.setStatus(exception.getStatusCode().toString());
        exceptionResponse.setDescription(exception.getReason());
        return ResponseEntity.status(exception.getStatusCode()).body(exceptionResponse);
    }

    @ExceptionHandler(AuthenticationException.class)
    public ResponseEntity<ExceptionResponseDto> authenticationExceptionHandler(final AuthenticationException exception) {
        final var exceptionResponse = new ExceptionResponseDto();
        exceptionResponse.setStatus(HttpStatus.FORBIDDEN.toString());
        exceptionResponse.setDescription(FORBIDDEN_ERROR_MESSAGE);
        return ResponseEntity.status(HttpStatus.FORBIDDEN).body(exceptionResponse);
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<ExceptionResponseDto> illegalArgumentExceptionHandler(final IllegalArgumentException exception) {
        final var exceptionResponse = new ExceptionResponseDto();
        exceptionResponse.setStatus(HttpStatus.BAD_REQUEST.toString());
        exceptionResponse.setDescription(exception.getMessage());
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(exceptionResponse);
    }

    @ExceptionHandler(TokenVerificationException.class)
    public ResponseEntity<ExceptionResponseDto> tokenVerificationExceptionHandler(final TokenVerificationException exception) {
        final var exceptionResponse = new ExceptionResponseDto();
        exceptionResponse.setStatus(HttpStatus.UNAUTHORIZED.toString());
        exceptionResponse.setDescription(exception.getReason());
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(exceptionResponse);
    }

    @ExceptionHandler(UsernameNotFoundException.class)
    public ResponseEntity<ExceptionResponseDto> usernameNotFoundExceptionHandler(final UsernameNotFoundException exception) {
        final var exceptionResponse = new ExceptionResponseDto();
        exceptionResponse.setStatus(HttpStatus.UNAUTHORIZED.toString());
        exceptionResponse.setDescription(exception.getMessage());
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(exceptionResponse);
    }

    @ExceptionHandler(ProcessEngineException.class)
    public ResponseEntity<ExceptionResponseDto> elementNotSupportedExceptionHandler(final ProcessEngineException exception) {
        final var exceptionResponse = new ExceptionResponseDto();
        exceptionResponse.setStatus(HttpStatus.INTERNAL_SERVER_ERROR.toString());
        exceptionResponse.setDescription(exception.getCode() + "-" + exception.getMessage());
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(exceptionResponse);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<?> serverExceptionHandler(final Exception exception) {
        final var exceptionResponse = new ExceptionResponseDto();
        exceptionResponse.setStatus(HttpStatus.NOT_IMPLEMENTED.toString());
        exceptionResponse.setDescription(SOMETHING_WRONG_MESSAGE + exception.getMessage());
        return ResponseEntity.status(HttpStatus.NOT_IMPLEMENTED).body(exceptionResponse);
    }
}