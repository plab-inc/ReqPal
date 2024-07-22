package inc.plab.bpmn.camunda;

import inc.plab.bpmn.exception.ElementNotSupportedException;
import org.camunda.bpm.engine.impl.bpmn.parser.AbstractBpmnParseListener;
import org.camunda.bpm.engine.impl.core.variable.mapping.IoMapping;
import org.camunda.bpm.engine.impl.persistence.entity.ProcessDefinitionEntity;
import org.camunda.bpm.engine.impl.pvm.process.ActivityImpl;
import org.camunda.bpm.engine.impl.pvm.process.ScopeImpl;
import org.camunda.bpm.engine.impl.pvm.process.TransitionImpl;
import org.camunda.bpm.engine.impl.util.xml.Element;
import org.camunda.bpm.engine.impl.variable.VariableDeclaration;

import java.util.Arrays;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

public class ParseListener extends AbstractBpmnParseListener {

    private static final Set<String> ALLOWED_DELEGATES = new HashSet<>(Arrays.asList(
            "${lessonUserTaskDelegate}",
            "${achievementDelegate}",
            "${xpDelegate}"
    ));

    private static final Set<String> ALLOWED_INPUT_PARAMETER_NAMES = new HashSet<>(Arrays.asList(
            "lessonId",
            "grantPointsAsXP",
            "objectiveId",
            "xp",
            "achievementId"
    ));

    private void validateDelegateExpression(Element element) {
        element.element("extensionElements").elements("executionListener").forEach(element1 -> {
            String delegateExpression = element1.attribute("delegateExpression");
            if (!ALLOWED_DELEGATES.contains(delegateExpression)) {
                throw new ElementNotSupportedException(element);
            }
        });
    }

    private void validateIoMapping(Element element) throws ElementNotSupportedException {
        element.element("inputOutput").elements().forEach(element1 -> {
            String attributeName = element1.attribute("name");
            if (!ALLOWED_INPUT_PARAMETER_NAMES.contains(attributeName)) {
                throw new ElementNotSupportedException(element);
            }
        });
    }

    @Override
    public void parseIoMapping(Element extensionElements, ActivityImpl activity, IoMapping inputOutput) throws ElementNotSupportedException {
        validateIoMapping(extensionElements);
    }

    @Override
    public void parseProcess(Element processElement, ProcessDefinitionEntity processDefinition) {
        super.parseProcess(processElement, processDefinition);
    }

    @Override
    public void parseStartEvent(Element startEventElement, ScopeImpl scope, ActivityImpl startEventActivity) {
        super.parseStartEvent(startEventElement, scope, startEventActivity);
    }

    @Override
    public void parseExclusiveGateway(Element exclusiveGwElement, ScopeImpl scope, ActivityImpl activity) {
        super.parseExclusiveGateway(exclusiveGwElement, scope, activity);
    }

    @Override
    public void parseServiceTask(Element serviceTaskElement, ScopeImpl scope, ActivityImpl activity) {
        super.parseServiceTask(serviceTaskElement, scope, activity);
    }

    @Override
    public void parseUserTask(Element userTaskElement, ScopeImpl scope, ActivityImpl activity) throws ElementNotSupportedException {
        validateDelegateExpression(userTaskElement);
    }

    @Override
    public void parseEndEvent(Element endEventElement, ScopeImpl scope, ActivityImpl activity) {
        super.parseEndEvent(endEventElement, scope, activity);
    }

    @Override
    public void parseSequenceFlow(Element sequenceFlowElement, ScopeImpl scopeElement, TransitionImpl transition) {
        super.parseSequenceFlow(sequenceFlowElement, scopeElement, transition);
    }

    @Override
    public void parseRootElement(Element rootElement, List<ProcessDefinitionEntity> processDefinitions) {
        super.parseRootElement(rootElement, processDefinitions);
    }

    //-- Not Supported BPMN Elements --

    @Override
    public void parseProperty(Element propertyElement, VariableDeclaration variableDeclaration, ActivityImpl activity) {
        throw new ElementNotSupportedException(propertyElement);
    }

    @Override
    public void parseInclusiveGateway(Element inclusiveGwElement, ScopeImpl scope, ActivityImpl activity) {
        throw new ElementNotSupportedException(inclusiveGwElement);
    }

    @Override
    public void parseParallelGateway(Element parallelGwElement, ScopeImpl scope, ActivityImpl activity) {
        throw new ElementNotSupportedException(parallelGwElement);
    }

    @Override
    public void parseScriptTask(Element scriptTaskElement, ScopeImpl scope, ActivityImpl activity) {
        throw new ElementNotSupportedException(scriptTaskElement);
    }

    @Override
    public void parseBusinessRuleTask(Element businessRuleTaskElement, ScopeImpl scope, ActivityImpl activity) {
        throw new ElementNotSupportedException(businessRuleTaskElement);
    }

    @Override
    public void parseTask(Element taskElement, ScopeImpl scope, ActivityImpl activity) {
        throw new ElementNotSupportedException(taskElement);
    }

    @Override
    public void parseManualTask(Element manualTaskElement, ScopeImpl scope, ActivityImpl activity) throws ElementNotSupportedException {
        throw new ElementNotSupportedException(manualTaskElement);
    }

    @Override
    public void parseBoundaryTimerEventDefinition(Element timerEventDefinition, boolean interrupting, ActivityImpl timerActivity) {
        throw new ElementNotSupportedException(timerEventDefinition);
    }

    @Override
    public void parseBoundaryErrorEventDefinition(Element errorEventDefinition, boolean interrupting, ActivityImpl activity, ActivityImpl nestedErrorEventActivity) {
        throw new ElementNotSupportedException(errorEventDefinition);
    }

    @Override
    public void parseSubProcess(Element subProcessElement, ScopeImpl scope, ActivityImpl activity) {
        throw new ElementNotSupportedException(subProcessElement);
    }

    @Override
    public void parseCallActivity(Element callActivityElement, ScopeImpl scope, ActivityImpl activity) {
        throw new ElementNotSupportedException(callActivityElement);
    }

    @Override
    public void parseSendTask(Element sendTaskElement, ScopeImpl scope, ActivityImpl activity) {
        throw new ElementNotSupportedException(sendTaskElement);
    }

    @Override
    public void parseMultiInstanceLoopCharacteristics(Element activityElement, Element multiInstanceLoopCharacteristicsElement, ActivityImpl activity) {
        throw new ElementNotSupportedException(activityElement);
    }

    @Override
    public void parseIntermediateTimerEventDefinition(Element timerEventDefinition, ActivityImpl timerActivity) {
        throw new ElementNotSupportedException(timerEventDefinition);
    }

    @Override
    public void parseReceiveTask(Element receiveTaskElement, ScopeImpl scope, ActivityImpl activity) {
        throw new ElementNotSupportedException(receiveTaskElement);
    }

    @Override
    public void parseIntermediateSignalCatchEventDefinition(Element signalEventDefinition, ActivityImpl signalActivity) {
        throw new ElementNotSupportedException(signalEventDefinition);
    }

    @Override
    public void parseBoundarySignalEventDefinition(Element signalEventDefinition, boolean interrupting, ActivityImpl signalActivity) {
        throw new ElementNotSupportedException(signalEventDefinition);
    }

    @Override
    public void parseEventBasedGateway(Element eventBasedGwElement, ScopeImpl scope, ActivityImpl activity) {
        throw new ElementNotSupportedException(eventBasedGwElement);
    }

    @Override
    public void parseTransaction(Element transactionElement, ScopeImpl scope, ActivityImpl activity) {
        throw new ElementNotSupportedException(transactionElement);
    }

    @Override
    public void parseCompensateEventDefinition(Element compensateEventDefinition, ActivityImpl compensationActivity) {
        throw new ElementNotSupportedException(compensateEventDefinition);
    }

    @Override
    public void parseIntermediateThrowEvent(Element intermediateEventElement, ScopeImpl scope, ActivityImpl activity) {
        throw new ElementNotSupportedException(intermediateEventElement);
    }

    @Override
    public void parseIntermediateCatchEvent(Element intermediateEventElement, ScopeImpl scope, ActivityImpl activity) {
        throw new ElementNotSupportedException(intermediateEventElement);
    }

    @Override
    public void parseBoundaryEvent(Element boundaryEventElement, ScopeImpl scopeElement, ActivityImpl nestedActivity) {
        throw new ElementNotSupportedException(boundaryEventElement);
    }

    @Override
    public void parseIntermediateMessageCatchEventDefinition(Element messageEventDefinition, ActivityImpl nestedActivity) {
        throw new ElementNotSupportedException(messageEventDefinition);
    }

    @Override
    public void parseBoundaryMessageEventDefinition(Element element, boolean interrupting, ActivityImpl messageActivity) {
        throw new ElementNotSupportedException(element);
    }

    @Override
    public void parseBoundaryEscalationEventDefinition(Element escalationEventDefinition, boolean interrupting, ActivityImpl boundaryEventActivity) {
        throw new ElementNotSupportedException(escalationEventDefinition);
    }

    @Override
    public void parseBoundaryConditionalEventDefinition(Element element, boolean interrupting, ActivityImpl conditionalActivity) {
        throw new ElementNotSupportedException(element);
    }

    @Override
    public void parseIntermediateConditionalEventDefinition(Element conditionalEventDefinition, ActivityImpl conditionalActivity) {
        throw new ElementNotSupportedException(conditionalEventDefinition);
    }

    @Override
    public void parseConditionalStartEventForEventSubprocess(Element element, ActivityImpl conditionalActivity, boolean interrupting) {
        throw new ElementNotSupportedException(element);
    }
}
