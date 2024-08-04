import { CheckboxEntry, Group, isTextFieldEntryEdited, TextFieldEntry } from "@bpmn-io/properties-panel";
import { getBusinessObject, is } from "bpmn-js/lib/util/ModelUtil.js";
import { jsx } from "@bpmn-io/properties-panel/preact/jsx-runtime";
import { useService } from "bpmn-js-properties-panel";
import { useScenarioModelerStore } from "@/stores/scenarioModeler.ts";

export function GeneralGroup(element, translate) {
  const group = {
    label: translate('General'),
    id: 'General',
    component: Group,
    entries: [...GeneralProps({ element, translate })]
  };

  if (group.entries.length) {
    return group;
  }

  return null;
}

function GeneralProps(props) {
  const { element } = props;
  const entries = [];

  if(!(is(element, 'bpmn:Process') || is(element, 'bpmn:UserTask') || is(element, 'bpmn:ServiceTask'))){
    entries.push({
      id: 'elementName',
      component: ElementName,
      isEdited: isTextFieldEntryEdited,
    });
  }
  return entries;
}

function ElementName(props) {
  const { element } = props;
  const debounce = useService("debounceInput");
  const translate = useService('translate');
  const modeling = useService('modeling');
  const disabled =  is(element, 'bpmn:Process') || is(element, 'bpmn:ServiceTask') || is(element, 'bpmn:UserTask');
  const label = is(element, 'bpmn:Process') ? "Szenario Title" : "Name";
  const scenarioModelerStore = useScenarioModelerStore();

  const getValue = () => {
    const businessObject = getBusinessObject(element);

    if(is(element, 'bpmn:Process')){
      return scenarioModelerStore.title;
    }

    return businessObject.name || '';
  };

  const setValue = (value) => {
    modeling.updateProperties(element, { name: value });
  };

  return jsx(TextFieldEntry, {
    element,
    id: "elementName",
    label: translate(label),
    getValue,
    disabled: disabled,
    debounce: debounce,
    setValue,
  });
}