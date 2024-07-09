package inc.plab.bpmn.exception;

import inc.plab.bpmn.dto.ExceptionResponseDto;
import io.jsonwebtoken.JwtException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.password.CompromisedPasswordException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;
import spinjar.com.fasterxml.jackson.databind.exc.InvalidFormatException;

import java.util.List;
import java.util.concurrent.atomic.AtomicReference;
import java.util.stream.Collectors;

import lombok.NonNull;

@ControllerAdvice
public class ExceptionResponseHandler extends ResponseEntityExceptionHandler {

    private static final String FORBIDDEN_ERROR_MESSAGE = "Access Denied: You do not have sufficient privileges to access this resource.";

    @ExceptionHandler(ResponseStatusException.class)
    public ResponseEntity<ExceptionResponseDto<String>> responseStatusExceptionHandler(final ResponseStatusException exception) {
        final var exceptionResponse = new ExceptionResponseDto<String>();
        exceptionResponse.setStatus(exception.getStatusCode().toString());
        exceptionResponse.setDescription(exception.getReason());
        return ResponseEntity.status(exception.getStatusCode()).body(exceptionResponse);
    }

    @ExceptionHandler(AuthenticationException.class)
    public ResponseEntity<ExceptionResponseDto<String>> authenticationExceptionHandler(final AuthenticationException exception) {
        final var exceptionResponse = new ExceptionResponseDto<String>();
        exceptionResponse.setStatus(HttpStatus.FORBIDDEN.toString());
        exceptionResponse.setDescription(FORBIDDEN_ERROR_MESSAGE);
        return ResponseEntity.status(HttpStatus.FORBIDDEN).body(exceptionResponse);
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<ExceptionResponseDto<String>> illegalArgumentExceptionHandler(final IllegalArgumentException exception) {
        final var exceptionResponse = new ExceptionResponseDto<String>();
        exceptionResponse.setStatus(HttpStatus.BAD_REQUEST.toString());
        exceptionResponse.setDescription(exception.getMessage());
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(exceptionResponse);
    }

    @ExceptionHandler(TokenVerificationException.class)
    public ResponseEntity<ExceptionResponseDto<String>> tokenVerificationExceptionHandler(final TokenVerificationException exception) {
        final var exceptionResponse = new ExceptionResponseDto<String>();
        exceptionResponse.setStatus(HttpStatus.UNAUTHORIZED.toString());
        exceptionResponse.setDescription(exception.getReason());
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(exceptionResponse);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<?> serverExceptionHandler(final Exception exception) {
        final var exceptionResponse = new ExceptionResponseDto<String>();
        exceptionResponse.setStatus(HttpStatus.NOT_IMPLEMENTED.toString());
        exceptionResponse.setDescription("Something went wrong.");
        return ResponseEntity.status(HttpStatus.NOT_IMPLEMENTED).body(exceptionResponse);
    }

}