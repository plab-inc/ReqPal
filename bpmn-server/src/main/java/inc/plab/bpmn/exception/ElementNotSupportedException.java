package inc.plab.bpmn.exception;

import org.camunda.bpm.engine.ProcessEngineException;
import org.camunda.bpm.engine.impl.util.xml.Element;

import java.io.Serial;

public class ElementNotSupportedException extends ProcessEngineException {

    @Serial
    private static final long serialVersionUID = 1L;

    public ElementNotSupportedException(Element element) {
        super("Element/Attribute is not supported in: " + element.toString());
    }
}