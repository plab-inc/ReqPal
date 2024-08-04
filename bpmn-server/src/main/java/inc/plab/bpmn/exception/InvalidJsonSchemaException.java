package inc.plab.bpmn.exception;

public class InvalidJsonSchemaException extends RuntimeException {

    public InvalidJsonSchemaException() {
        super();
    }

    public InvalidJsonSchemaException(String message) {
        super(message);
    }

    public InvalidJsonSchemaException(String message, Throwable cause) {
        super(message, cause);
    }

    public InvalidJsonSchemaException(Throwable cause) {
        super(cause);
    }
}
