import { CheckboxEntry, Group, isTextFieldEntryEdited, TextFieldEntry } from "@bpmn-io/properties-panel";
import { getBusinessObject, is } from "bpmn-js/lib/util/ModelUtil.js";
import { jsx } from "@bpmn-io/properties-panel/preact/jsx-runtime";
import { useService } from "bpmn-js-properties-panel";

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

  entries.push({
    id: 'elementName',
    component: ElementName,
    isEdited: isTextFieldEntryEdited,
  });

  if (is(element, 'bpmn:Process')) {
    entries.push({
      id: 'elementIsExecutable',
      component: ElementIsExecutable,
      isEdited: isTextFieldEntryEdited,
    });
  }

  return entries;
}

function ElementIsExecutable(props) {
  const { element } = props;
  const debounce = useService('debounceInput');
  const translate = useService('translate');
  const modeling = useService('modeling');

  const getValue = () => {
    const businessObject = getBusinessObject(element);
    return businessObject ? !!businessObject.isExecutable : false;
  };

  const setValue = (value) => {
    const businessObject = getBusinessObject(element);
    if (businessObject) {
      modeling.updateProperties(element, { isExecutable: value });
    }
  };

  return jsx(CheckboxEntry, {
    element,
    id: "elementIsExecutable",
    label: translate('Is Executable'),
    getValue,
    debounce: debounce,
    setValue,
    disabled: false
  });
}

function ElementName(props) {
  const { element } = props;
  const debounce = useService("debounceInput");
  const translate = useService('translate');
  const modeling = useService('modeling');
  const label = is(element, 'bpmn:Process') ? "Szenario Name" : "Name"

  const getValue = () => {
    const businessObject = getBusinessObject(element);

    if(is(element, 'bpmn:Process')){
      return (businessObject.id && businessObject.name) ? businessObject.name : '';
    }

    return businessObject.name || '';
  };

  const setValue = (value) => {

    if(is(element, 'bpmn:Process')){
      //TODO not sure if i want to keep this when Szenario Names are called via the client
      modeling.updateProperties(element, { id: value ? value : "Process_1" });
    }

    modeling.updateProperties(element, { name: value });
  };

  const validate = (value) => {

    if(is(element, 'bpmn:Process')){
      //TODO Call gegen Store

      if(!value){ return "Szenario name can not be empty"; }
      if(value.length < 5){ return "Szenario name is too short"; }

      if(is(element, 'bpmn:Process') && value === "Process_1"){
        return "Szenario name already in use";
      }
    }

    return false;
  }

  return jsx(TextFieldEntry, {
    element,
    id: "elementName",
    label: translate(label),
    getValue,
    validate,
    debounce: debounce,
    setValue,
  });
}