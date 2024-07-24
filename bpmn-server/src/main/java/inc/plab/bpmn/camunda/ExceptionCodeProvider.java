package inc.plab.bpmn.camunda;

import inc.plab.bpmn.exception.ElementNotSupportedException;
import org.camunda.bpm.engine.ProcessEngineException;

public class ExceptionCodeProvider implements org.camunda.bpm.engine.impl.errorcode.ExceptionCodeProvider {
    @Override
    public Integer provideCode(ProcessEngineException processEngineException) {
        if (processEngineException.getCause() instanceof ElementNotSupportedException) {
            return 22_222;
        }
        return processEngineException.getCode();
    }
}