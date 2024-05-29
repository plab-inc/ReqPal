import {
  Group,
  isSelectEntryEdited,
  isTextAreaEntryEdited,
  isTextFieldEntryEdited,
  SelectEntry,
  TextAreaEntry
} from "@bpmn-io/properties-panel";
import { getBusinessObject, is } from "bpmn-js/lib/util/ModelUtil.js";
import { isAny } from "bpmn-js/lib/features/modeling/util/ModelingUtil.js";
import { useService } from "bpmn-js-properties-panel";
import { jsx } from "@bpmn-io/properties-panel/preact/jsx-runtime";
import { find } from "min-dash";

export function ConditionGroup(element, translate) {
  const group = {
    label: translate('Condition'),
    id: 'CamundaPlatform__Condition',
    component: Group,
    entries: [...ConditionProps({
      element
    })]
  };
  if (group.entries.length) {
    return group;
  }
  return null;
}

function ConditionProps(props) {
  const {
    element
  } = props;
  if (!(is(element, 'bpmn:SequenceFlow') && isConditionalSource(element.source)) && !getConditionalEventDefinition(element)) {
    return [];
  }
  const entries = [];

  entries.push({
    id: 'conditionType',
    component: ConditionType,
    isEdited: isSelectEntryEdited
  });

  const conditionType = getConditionType(element);

  if (conditionType === 'script') {
    entries.push(...ConditionScriptProps({
      element
    }));
  }
  return entries;
}

const CONDITIONAL_SOURCES = ['bpmn:ExclusiveGateway', 'bpmn:InclusiveGateway', 'bpmn:ComplexGateway'];

function isConditionalSource(element) {
  return isAny(element, CONDITIONAL_SOURCES);
}
function getConditionalEventDefinition(element) {
  if (!is(element, 'bpmn:Event')) {
    return false;
  }
  return getEventDefinition$1(element, 'bpmn:ConditionalEventDefinition');
}

function getEventDefinition$1(element, eventType) {
  const businessObject = getBusinessObject(element);
  const eventDefinitions = businessObject.get('eventDefinitions') || [];
  return find(eventDefinitions, function (definition) {
    return is(definition, eventType);
  });
}

function getConditionType(element) {
  const conditionExpression = getConditionExpression(element);
  if (!conditionExpression) {
    return '';
  } else {
    return 'script';
  }
}

function ConditionType(props) {
  const {
    element
  } = props;
  const commandStack = useService('commandStack');
  const bpmnFactory = useService('bpmnFactory');
  const translate = useService('translate');
  const getValue = () => {
    return getConditionType(element);
  };
  const setValue = value => {
    // (1) Create and set formalExpression element containing the conditionExpression
    const attributes = {
      body: '',
      language: 'JavaScript'
    };
    const formalExpressionElement = createFormalExpression(element, attributes, bpmnFactory);
    updateCondition(element, commandStack, formalExpressionElement);
  };
  const getOptions = () => [{
    value: 'script',
    label: translate('Points')
  }];
  return jsx(SelectEntry, {
    element: element,
    id: "conditionType",
    label: translate('Type'),
    getValue: getValue,
    setValue: setValue,
    getOptions: getOptions
  });
}

function createFormalExpression(parent, attributes, bpmnFactory) {
  return createElement('bpmn:FormalExpression', attributes, is(parent, 'bpmn:SequenceFlow') ? getBusinessObject(parent) : getConditionalEventDefinition(parent), bpmnFactory);
}

function updateCondition(element, commandStack, condition = undefined) {
  if (is(element, 'bpmn:SequenceFlow')) {
    commandStack.execute('element.updateProperties', {
      element,
      properties: {
        conditionExpression: condition
      }
    });
  } else {
    commandStack.execute('element.updateModdleProperties', {
      element,
      moddleElement: getConditionalEventDefinition(element),
      properties: {
        condition
      }
    });
  }
}

function createElement(type, properties, parent, bpmnFactory) {
  const element = bpmnFactory.create(type, properties);
  if (parent) {
    element.$parent = parent;
  }
  return element;
}

function ConditionScriptProps(props) {
  const {
    element
  } = props;
  const entries = [];

  entries.push({
    id: 'conditionScriptValue',
    component: Script$1,
    isEdited: isTextAreaEntryEdited
  });

  return entries;
}

function Script$1(props) {
  const {
    element
  } = props;
  const commandStack = useService('commandStack');
  const translate = useService('translate');
  const debounce = useService('debounceInput');
  const getValue = () => {
    return transformScriptToDisplay(getConditionExpression(element).get('body'));
  };
  const setValue = value => {
    const transformedValue = transformDisplayToScript(value);
    commandStack.execute('element.updateModdleProperties', {
      element: element,
      moddleElement: getConditionExpression(element),
      properties: {
        'body': transformedValue || ''
      }
    });
  };
  const description = translate('Enter the condition in the form of "points >= 50".');
  return jsx(TextAreaEntry, {
    element: element,
    id: "conditionScriptValue",
    label: translate('Condition calculation'),
    description: description,
    getValue: getValue,
    setValue: setValue,
    debounce: debounce,
    monospace: true
  });
}

function getConditionExpression(element) {
  const businessObject = getBusinessObject(element);
  if (is(businessObject, 'bpmn:SequenceFlow')) {
    return businessObject.get('conditionExpression');
  } else if (getConditionalEventDefinition(businessObject)) {
    return getConditionalEventDefinition(businessObject).get('condition');
  }
}

function transformScriptToDisplay(script) {
  if (script && script.startsWith('item.data.')) {
    return script.replace('item.data.', '');
  }
  return script;
}

function transformDisplayToScript(displayValue) {
  if (displayValue) {
    return `item.data.${displayValue}`;
  }
  return displayValue;
}