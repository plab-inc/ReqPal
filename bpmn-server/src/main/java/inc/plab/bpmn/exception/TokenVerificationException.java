package inc.plab.bpmn.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

import java.io.Serial;

public class TokenVerificationException extends ResponseStatusException {

    @Serial
    private static final long serialVersionUID = 1L;

    private static final String DEFAULT_MESSAGE = "Authentication failure: Token missing, invalid, revoked or expired";

    public TokenVerificationException() {
        super(HttpStatus.UNAUTHORIZED, DEFAULT_MESSAGE);
    }

}