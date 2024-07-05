import { getBusinessObject, is } from "bpmn-js/lib/util/ModelUtil.js";

export function setInputParameters(element, modeling, bpmnFactory, variableName, value) {
  const businessObject = getBusinessObject(element);

  if (!businessObject.extensionElements) {
    businessObject.extensionElements = bpmnFactory.create('bpmn:ExtensionElements', {
      values: []
    });
  }

  const extensionElements = businessObject.extensionElements;

  let inputOutput = extensionElements.values.find(value => is(value, 'camunda:InputOutput'));

  if (!inputOutput) {
    inputOutput = bpmnFactory.create('camunda:InputOutput', {
      inputParameters: [],
      outputParameters: []
    });
    extensionElements.values.push(inputOutput);
  }

  let inputParameter = inputOutput.inputParameters.find(param => param.name === variableName) ||
    bpmnFactory.create('camunda:InputParameter', { name: variableName });

  inputParameter.value = value;

  if (!inputOutput.inputParameters.includes(inputParameter)) {
    inputOutput.inputParameters.push(inputParameter);
  }

  modeling.updateProperties(element, {
    extensionElements: extensionElements
  });
}