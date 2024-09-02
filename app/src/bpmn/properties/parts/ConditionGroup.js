import {
  Group,
  isSelectEntryEdited,
  isTextAreaEntryEdited,
  SelectEntry,
  TextFieldEntry
} from "@bpmn-io/properties-panel";
import { getBusinessObject, is } from "bpmn-js/lib/util/ModelUtil.js";
import { isAny } from "bpmn-js/lib/features/modeling/util/ModelingUtil.js";
import { useService } from "bpmn-js-properties-panel";
import { jsx } from "@bpmn-io/properties-panel/preact/jsx-runtime";

export function ConditionGroup(element, translate) {
  const group = {
    label: translate("Condition"),
    id: "CamundaPlatform__Condition",
    component: Group,
    entries: [...ConditionProps({ element })]
  };

  if (group.entries.length) {
    return group;
  }
  return null;
}

function ConditionProps(props) {
  const { element } = props;
  if (!(is(element, "bpmn:SequenceFlow") && isConditionalSource(element.source))) {
    return [];
  }

  const entries = [];
  entries.push({
    id: "conditionType",
    component: ConditionType,
    isEdited: isSelectEntryEdited
  });

  if (getConditionType(element)) {
    entries.push(...ConditionExpressionProps({
      element
    }));
  }
  return entries;
}

function ConditionType(props) {
  const { element } = props;
  const commandStack = useService("commandStack");
  const bpmnFactory = useService("bpmnFactory");
  const translate = useService("translate");
  const modeling = useService("modeling");

  const getValue = () => {
    const conditionType = getConditionType(element);
    if (conditionType === "formalExpression") {
      const body = getConditionExpression(element).get("body");
      return parseConditionTypeFromBody(body);
    }
    return conditionType;
  };

  const setValue = (value) => {
    if (value === "defaultFlow") {
      setDefaultFlow(element, modeling, commandStack);
      return;
    }

    const attributes = {
      body: "",
      conditionType: value
    };
    const formalExpressionElement = createFormalExpression(element, attributes, bpmnFactory);
    updateCondition(element, commandStack, formalExpressionElement, value);
    updateGateway(element, commandStack, formalExpressionElement, value);
  };

  const getOptions = () => [
    {
      value: "defaultFlow",
      label: translate("Default Flow")
    },
    {
      value: "lastLessonAchievedPoints",
      label: translate("Last Lesson Achieved Points")
    },
    {
      value: "totalPoints",
      label: translate("Total Achieved Points")
    },
    {
      value: "lastLessonCompletionTimeMinutes",
      label: translate("Time To Complete Last Lesson In Minutes")
    }
  ];

  return jsx(SelectEntry, {
    element: element,
    id: "conditionType",
    label: translate("Type"),
    getValue: getValue,
    setValue: setValue,
    getOptions: getOptions
  });
}

function ConditionExpressionProps(props) {
  const { element } = props;
  const entries = [];

  entries.push({
    id: "conditionExpressionValue",
    component: ConditionExpression,
    isEdited: isTextAreaEntryEdited
  });

  return entries;
}

function ConditionExpression(props) {
  const { element } = props;
  const conditionType = getConditionType(element);
  const commandStack = useService("commandStack");
  const translate = useService("translate");
  const debounce = useService("debounceInput");
  const getValue = () => {
    return transformScriptToDisplay(getConditionExpression(element).get("body"));
  };
  const setValue = value => {
    const transformedValue = transformDisplayToScript(value, conditionType);
    commandStack.execute("element.updateModdleProperties", {
      element: element,
      moddleElement: getConditionExpression(element),
      properties: {
        "body": transformedValue || ""
      }
    });
  };
  const description = translate("Enter the condition in the form of >=$");
  return jsx(TextFieldEntry, {
    element: element,
    id: "conditionScriptValue",
    label: translate("Condition calculation"),
    description: description,
    getValue: getValue,
    setValue: setValue,
    placeholder: '>=50',
    debounce: debounce,
    monospace: true,
    validate: (value) => {
      if (!value) {
        return translate("Required.");
      }
    }
  });
}

// ----------------Helper----------------

// :( Buggy as f
function transformScriptToDisplay(script) {
  if (script.startsWith("${") && script.endsWith("}")) {
    const expression = script.slice(2, -1).trim();
    const match = expression.match(/[><=]+\s*\d+/);
    return match ? match[0].replace(/\s+/g, '') : "";
  }
  return script;
}

function transformDisplayToScript(displayValue, conditionType) {
  if (displayValue && conditionType) {
    return `\${${conditionType.trim()}${displayValue.trim().replace(/\s+/g, '')}}`;
  }
  return conditionType ? `\${${conditionType.trim()}}` : "";
}


const CONDITIONAL_SOURCES = ["bpmn:ExclusiveGateway", "bpmn:InclusiveGateway", "bpmn:ComplexGateway"];

function camelCaseToTitleCase(str) {
  return str.replace(/([A-Z])/g, " $1").replace(/^./, (match) => match.toUpperCase());
}

function getConditionExpression(element) {
  const businessObject = getBusinessObject(element);
  if (is(businessObject, "bpmn:SequenceFlow")) {
    return businessObject.get("conditionExpression");
  }
}

function isConditionalSource(element) {
  return isAny(element, CONDITIONAL_SOURCES);
}

function createElement(type, properties, parent, bpmnFactory) {
  const element = bpmnFactory.create(type, properties);
  if (parent) {
    element.$parent = parent;
  }
  return element;
}

function getConditionType(element) {
  const conditionExpression = getConditionExpression(element);
  if (conditionExpression) {
    return conditionExpression.get("conditionType") || "formalExpression";
  }
  return undefined;
}

function parseConditionTypeFromBody(body) {
  if (body.includes("lastLessonAchievedPoints")) {
    return "lastLessonAchievedPoints";
  }
  if (body.includes("totalPoints")) {
    return "totalPoints";
  }
  if (body.includes("lastLessonCompletionTimeMinutes")) {
    return "lastLessonCompletionTimeMinutes";
  }
  return "formalExpression";
}

function createFormalExpression(parent, attributes, bpmnFactory) {
  return createElement("bpmn:FormalExpression", attributes, getBusinessObject(parent), bpmnFactory);
}

function updateCondition(element, commandStack, condition = undefined, type) {
  if (is(element, "bpmn:SequenceFlow")) {
    commandStack.execute("element.updateProperties", {
      element,
      properties: {
        conditionExpression: condition,
        name: camelCaseToTitleCase(type)
      }
    });
  }
}

function updateGateway(element, commandStack, condition = undefined, type) {
  const source = element.source;
  if (source && is(source, "bpmn:ExclusiveGateway")) {
    commandStack.execute("element.updateProperties", {
      element: source,
      properties: {
        name: `Gateway for ${camelCaseToTitleCase(type)}`
      }
    });
  }
}

function setDefaultFlow(element, modeling, commandStack) {
  const source = element.source;
  if (isAny(source, ["bpmn:ExclusiveGateway", "bpmn:InclusiveGateway", "bpmn:ComplexGateway"])) {
    commandStack.execute("element.updateProperties", {
      element,
      properties: {
        name: ""
      }
    });
    modeling.updateProperties(source, {
      default: element
    });
  }
}