import { Group, isTextAreaEntryEdited, isTextFieldEntryEdited, TextAreaEntry } from "@bpmn-io/properties-panel";
import { getBusinessObject, is } from "bpmn-js/lib/util/ModelUtil";
import { jsx } from "@bpmn-io/properties-panel/preact/jsx-runtime";
import { useService } from "bpmn-js-properties-panel";
import { useScenarioModelerStore } from "@/stores/scenarioModeler.ts";
import { without } from "min-dash";

export function DocumentationGroup(element, translate) {
  const group = {
    label: translate("Documentation"),
    id: "documentation",
    component: Group,
    entries: [...DocumentationProps({ element, translate })]
  };

  if (group.entries.length) {
    return group;
  }

  return null;
}

function DocumentationProps(props) {
  const { element } = props;

  const entries = [];

  if(!(is(element, 'bpmn:Process'))){
    entries.push({
      id: "documentation",
      component: ElementDocumentationProperty,
      isEdited: isTextAreaEntryEdited
    });
  }
  return entries;

}

function ElementDocumentationProperty(props) {
  const { element } = props;
  const bpmnFactory = useService("bpmnFactory");
  const commandStack = useService("commandStack");
  const translate = useService("translate");
  const debounce = useService("debounceInput");
  const disabled =  is(element, 'bpmn:Process');
  const label = is(element, 'bpmn:Process') ? "Szenario Description" : "Element Documentation";
  const scenarioModelerStore = useScenarioModelerStore();

  const getValue = () => {
    const businessObject = getBusinessObject(element);

    if (is(element, "bpmn:Process")) {
      return scenarioModelerStore.description || "";
    }

    const documentation = findDocumentation(businessObject.get("documentation"));
    return documentation && documentation.text;
  };

  const setValue = (value) => {
    const businessObject = getBusinessObject(element);

    let documentation = findDocumentation(businessObject.get("documentation"));

    if (documentation) {
      if (value) {
        return commandStack.execute("element.updateModdleProperties", {
          element,
          moddleElement: documentation,
          properties: {
            text: value
          }
        });
      } else {
        return commandStack.execute("element.updateModdleProperties", {
          element,
          moddleElement: businessObject,
          properties: {
            documentation: without(businessObject.get("documentation"), documentation)
          }
        });
      }
    }

    if (value) {
      documentation = bpmnFactory.create("bpmn:Documentation", {
        text: value
      });
      return commandStack.execute("element.updateModdleProperties", {
        element,
        moddleElement: businessObject,
        properties: {
          documentation: [...businessObject.get("documentation"), documentation]
        }
      });
    }
  };

  return jsx(TextAreaEntry, {
    element,
    id: "documentation",
    label: translate(label),
    disabled: disabled,
    getValue,
    setValue,
    debounce
  });
}

function findDocumentation(docs) {
  return docs.find(function(d) {
    return (d.textFormat || "text/plain") === "text/plain";
  });
}