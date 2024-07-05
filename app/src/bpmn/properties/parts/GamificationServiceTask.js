import { Group, isSelectEntryEdited, SelectEntry, TextFieldEntry } from "@bpmn-io/properties-panel";
import { getBusinessObject, is } from "bpmn-js/lib/util/ModelUtil.js";
import { jsx } from "@bpmn-io/properties-panel/preact/jsx-runtime";
import { useService } from "bpmn-js-properties-panel";
import { setInputParameters } from "@/bpmn/properties/util/Helper.js";

export function ServiceTaskGroup(element, translate) {
  const group = {
    label: translate('Gamification Services'),
    id: 'GamificationService',
    component: Group,
    entries: [...ServiceTaskProps({ element, translate })]
  };
  if (group.entries.length) {
    return group;
  }
  return null;
}

function ServiceTaskProps(props) {
  const { element } = props;
  if (!(is(element, 'bpmn:ServiceTask'))) {return [];}
  const entries = [];

  entries.push({
    id: 'serviceTaskType',
    component: ServiceTaskType,
    isEdited: isSelectEntryEdited,
  });

  const taskType = getServiceTaskType(element);

  if (taskType === 'assignAchievement') {
    entries.push({
      id: 'achievementToAssign',
      component: AssignAchievementTaskType,
      isEdited: isSelectEntryEdited,
    });
  }

  if (taskType === 'grantXPToObjective') {
    entries.push({
      id: 'selectObjective',
      component: SelectObjectiveType,
      isEdited: isSelectEntryEdited,
    });
    entries.push({
      id: 'xpToGrant',
      component: XPValueType,
      isEdited: isSelectEntryEdited,
    });
  }

  return entries;
}

function ServiceTaskType(props) {
  const { element } = props;
  const translate = useService('translate');
  const modeling = useService('modeling');

  const getValue = () => getServiceTaskType(element);

  const setValue = (value) => {
    modeling.updateProperties(element, { serviceTaskType: value })
  };

  const getOptions = () => [
    { value: 'assignAchievement', label: translate('Assign Achievement') },
    { value: 'grantXPToObjective', label: translate('Grant XP To Learning Objective') }
  ];

  return jsx(SelectEntry, {
    element,
    id: "serviceTaskType",
    label: translate('Service Task Type'),
    getValue,
    setValue,
    getOptions,
    validate: (element) => {
      if (!element) {
        return translate('Required.');
      }
    }
  });
}

function XPValueType(props) {
  const { element } = props;
  const modeling = useService('modeling');
  const translate = useService("translate");
  const bpmnFactory = useService('bpmnFactory');
  const debounce = useService("debounceInput");
  const getValue = () => {
    return element.businessObject.xp || '';
  }

  const setValue = (value) => {
    const businessObject = element.businessObject;
    const name = businessObject.get('name') || '';
    const baseName = name.split('\nXP:')[0];
    const label = (value && baseName) ? (baseName + "\nXP: " + value) : baseName;

    businessObject.set('xp', value)
    businessObject.set('name', label)
    setInputParameters(element, modeling, bpmnFactory, "xp", value);
  }

  return jsx(TextFieldEntry, {
    element: element,
    id: "XPToGrantValue",
    label: translate('XP granted to the selected objective'),
    getValue: getValue,
    setValue: setValue,
    debounce: debounce,
    monospace: true,
    validate: (element) => {
      if (!element) {
        return translate('Required.');
      }
    }
  });
}

function SelectObjectiveType(props) {
  const { element } = props;
  const bpmnFactory = useService('bpmnFactory');
  const translate = useService('translate');
  const modeling = useService('modeling');

  const getValue = () => {
    return getObjectiveToGrantXP(element);
  };

  const setValue = (value) => {
    const businessObject = element.businessObject;
    const objectives = getOptions();
    const selectedObjective = objectives.find(objective => objective.value === value);
    const label = selectedObjective ? 'Grant XP to Objective:\n' + selectedObjective.label : '';

    businessObject.set('objectiveToGrantXPTo', value);
    businessObject.set('name', label);

    setInputParameters(element, modeling, bpmnFactory, "objectiveId", value);
    addImplementation(element, modeling, "${xpDelegate}");
  };

  const getOptions = () => {
    return [
      { value: 'a', label: 'ObA' },
      { value: 'b', label: 'ObB' },
      { value: 'c', label: 'ObC' }
    ]
  };

  return jsx(SelectEntry, {
    element: element,
    id: "objectiveToGrantXP",
    label: translate('Objective to grant XP to'),
    getValue: getValue,
    setValue: setValue,
    getOptions: getOptions,
    validate: (element) => {
      if (!element) {
        return translate('Required.');
      }
    }
  });
}

function AssignAchievementTaskType(props) {
  const { element } = props;
  const bpmnFactory = useService('bpmnFactory');
  const translate = useService('translate');
  const modeling = useService('modeling');

  const getValue = () => {
    return getAchievementToAssign(element);
  };

  const setValue = (value) => {
    const businessObject = element.businessObject;
    const achievements = getOptions();
    const selectedAchievement = achievements.find(achievement => achievement.value === value);
    const label = selectedAchievement ? 'Assign Achievement:\n' + selectedAchievement.label : '';

    businessObject.set('achievementToAssign', value);
    businessObject.set('name', label);

    setInputParameters(element, modeling, bpmnFactory, 'achievementId', value)
    addImplementation(element, modeling, "${achievementDelegate}");
  };

  const getOptions = () => {
    return [
      { value: 'a', label: 'A' },
      { value: 'b', label: 'B' },
      { value: 'c', label: 'C' }
    ]
  };

  return jsx(SelectEntry, {
    element: element,
    id: "achievementToAssign",
    label: translate('Achievement to assign to the user'),
    getValue: getValue,
    setValue: setValue,
    getOptions: getOptions,
    validate: (element) => {
      if (!element) {
        return translate('Required.');
      }
    }
  });
}

// ----------------Helper----------------

function getAchievementToAssign(element) {
  const businessObject = element.businessObject;
  return businessObject.get('achievementToAssign');
}

function getObjectiveToGrantXP(element) {
  const businessObject = element.businessObject;
  return businessObject.get('objectiveToGrantXPTo');
}

function getServiceTaskType(element) {
  const businessObject = element.businessObject;
  return businessObject.get('serviceTaskType');
}

function addImplementation(element, modeling, delegate) {
  modeling.updateProperties(element, {
    'camunda:delegateExpression': delegate.toString()
  });
}